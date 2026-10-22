'use server';
import {redirect} from 'next/navigation';import {revalidatePath} from 'next/cache';import {requireClinicalWorkspace} from '@/lib/auth/guards';import {addClinicalNote,amendNote,completeEncounter,createAlert,createPrescription,resolveAlert,setResultRelease,startEncounter,updatePrescription} from '@/lib/clinical/mutations';
const vals=(f:FormData)=>Object.fromEntries(Array.from(f.entries()).filter((x):x is [string,string]=>typeof x[1]==='string'));
export async function startAction(f:FormData){const a=await requireClinicalWorkspace();const e=await startEncounter(a,String(f.get('appointmentId')));redirect(`/clinical/encounters/${e.id}`)}
export async function noteAction(f:FormData){const a=await requireClinicalWorkspace(),v=vals(f);await addClinicalNote(a,v.encounterId,v);revalidatePath(`/clinical/encounters/${v.encounterId}`)}
export async function alertAction(f:FormData){const a=await requireClinicalWorkspace(),v=vals(f);await createAlert(a,v.patientId,v);revalidatePath(`/clinical/patients/${v.patientId}`)}
export async function prescriptionAction(f:FormData){const a=await requireClinicalWorkspace(),v=vals(f);await createPrescription(a,v.encounterId,v);revalidatePath(`/clinical/encounters/${v.encounterId}`)}
export async function completeAction(f:FormData){const a=await requireClinicalWorkspace(),id=String(f.get('encounterId'));await completeEncounter(a,id);redirect('/clinical')}
export async function amendAction(f:FormData){const a=await requireClinicalWorkspace(),v=vals(f);await amendNote(a,v.noteId,v.content,v.reason);revalidatePath(`/clinical/encounters/${v.encounterId}`)}
export async function resolveAlertAction(f:FormData){const a=await requireClinicalWorkspace();await resolveAlert(a,String(f.get('alertId')));revalidatePath(`/clinical/patients/${String(f.get('patientId'))}`)}
export async function resultReleaseAction(f:FormData){const a=await requireClinicalWorkspace();await setResultRelease(a,String(f.get('resultId')),f.get('visible')==='true');revalidatePath(`/clinical/patients/${String(f.get('patientId'))}`)}
export async function prescriptionUpdateAction(f:FormData){const a=await requireClinicalWorkspace();await updatePrescription(a,String(f.get('prescriptionId')),String(f.get('status')) as 'DRAFT'|'ISSUED'|'CANCELLED'|'EXPIRED',f.get('visible')==='on');revalidatePath(`/clinical/encounters/${String(f.get('encounterId'))}`)}
