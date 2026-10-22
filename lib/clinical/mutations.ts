import { and, eq, sql } from 'drizzle-orm';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { assertClinicalAuthor } from './access';
import { getDatabase } from '@/lib/db/client';
import { appointments, auditLogs, clinicalEncounters, clinicalNoteRevisions, clinicalNotes, patientAlerts, prescriptions, prescriptionItems, testResults } from '@/lib/db/schema';

const clean = (value: string | undefined, max: number) => { const result=(value??'').trim(); if(!result||result.length>max)throw new Error('Required clinical information is invalid.'); return result; };
export async function startEncounter(actor: AuthenticatedUser, appointmentId: string) {
  assertClinicalAuthor(actor);
  return getDatabase().transaction(async tx => {
    const [appointment] = await tx.select().from(appointments).where(and(eq(appointments.id, appointmentId), eq(appointments.practitionerId, actor.practitionerId))).limit(1);
    if (!appointment || appointment.status !== 'ARRIVED') throw new Error('Only an arrived appointment assigned to this clinician can be started.');
    const [existing] = await tx.select().from(clinicalEncounters).where(eq(clinicalEncounters.appointmentId, appointmentId)).limit(1);
    if (existing) return existing;
    const [created] = await tx.insert(clinicalEncounters).values({ patientId: appointment.patientId, practitionerId: actor.practitionerId, appointmentId, departmentId: appointment.departmentId, encounterType: 'CONSULTATION', status: 'IN_PROGRESS', startedAt: new Date() }).returning();
    await tx.update(appointments).set({ status: 'IN_CONSULTATION', updatedAt: new Date() }).where(eq(appointments.id, appointmentId));
    return created;
  });
}
export async function addClinicalNote(actor: AuthenticatedUser, encounterId: string, values: Record<string,string>) {
  assertClinicalAuthor(actor); const content=clean(values.content,10000);
  return getDatabase().transaction(async tx=>{const [encounter]=await tx.select().from(clinicalEncounters).where(eq(clinicalEncounters.id,encounterId)).limit(1);if(!encounter)throw new Error('Encounter not found.');const [note]=await tx.insert(clinicalNotes).values({encounterId,patientId:encounter.patientId,authorPractitionerId:actor.practitionerId,type:(values.type||'CONSULTATION') as typeof clinicalNotes.type.enumValues[number],content,patientVisible:values.patientVisible==='on'}).returning();await tx.insert(clinicalNoteRevisions).values({clinicalNoteId:note.id,revisionNumber:1,contentSnapshot:content,amendedByPractitionerId:actor.practitionerId,amendmentReason:'Initial immutable snapshot'});return note});
}
export async function amendNote(actor:AuthenticatedUser,noteId:string,content:string,reason:string){assertClinicalAuthor(actor);return getDatabase().transaction(async tx=>{const[note]=await tx.select().from(clinicalNotes).where(eq(clinicalNotes.id,noteId)).limit(1);if(!note)throw new Error('Clinical note not found.');const revision=note.currentRevision+1;await tx.insert(clinicalNoteRevisions).values({clinicalNoteId:note.id,revisionNumber:revision,contentSnapshot:note.content,amendedByPractitionerId:actor.practitionerId,amendmentReason:clean(reason,500)});const[updated]=await tx.update(clinicalNotes).set({content:clean(content,10000),currentRevision:revision,updatedAt:new Date()}).where(eq(clinicalNotes.id,noteId)).returning();return updated})}
export async function completeEncounter(actor:AuthenticatedUser,id:string){assertClinicalAuthor(actor);await getDatabase().update(clinicalEncounters).set({status:'COMPLETED',completedAt:new Date(),updatedAt:new Date()}).where(and(eq(clinicalEncounters.id,id),eq(clinicalEncounters.practitionerId,actor.practitionerId)))}
export async function createAlert(actor:AuthenticatedUser,patientId:string,v:Record<string,string>){assertClinicalAuthor(actor);return getDatabase().insert(patientAlerts).values({patientId,type:(v.type||'OTHER')as typeof patientAlerts.type.enumValues[number],description:clean(v.description,2000),authoredByPractitionerId:actor.practitionerId}).returning()}
export async function resolveAlert(actor:AuthenticatedUser,id:string){assertClinicalAuthor(actor);await getDatabase().update(patientAlerts).set({active:false,resolvedAt:new Date(),resolvedByPractitionerId:actor.practitionerId,updatedAt:new Date()}).where(eq(patientAlerts.id,id))}
export async function setResultRelease(actor:AuthenticatedUser,id:string,visible:boolean){assertClinicalAuthor(actor);await getDatabase().update(testResults).set({patientVisible:visible,releasedAt:visible?new Date():null,releasedByPractitionerId:visible?actor.practitionerId:null,updatedAt:new Date()}).where(eq(testResults.id,id))}
export async function createPrescription(actor:AuthenticatedUser,encounterId:string,v:Record<string,string>){assertClinicalAuthor(actor);return getDatabase().transaction(async tx=>{const[e]=await tx.select().from(clinicalEncounters).where(eq(clinicalEncounters.id,encounterId)).limit(1);if(!e)throw new Error('Encounter not found.');const[p]=await tx.insert(prescriptions).values({patientId:e.patientId,encounterId,prescribingPractitionerId:actor.practitionerId,instructions:v.instructions||null}).returning();await tx.insert(prescriptionItems).values({prescriptionId:p.id,medicationName:clean(v.medicationName,255),doseInstructions:clean(v.doseInstructions,500),frequency:v.frequency||null,duration:v.duration||null});return p})}
export async function updatePrescription(actor:AuthenticatedUser,id:string,status:typeof prescriptions.status.enumValues[number],visible:boolean){assertClinicalAuthor(actor);await getDatabase().update(prescriptions).set({status,patientVisible:visible,prescribedAt:status==='ISSUED'?new Date():undefined,updatedAt:new Date()}).where(and(eq(prescriptions.id,id),eq(prescriptions.prescribingPractitionerId,actor.practitionerId)))}
