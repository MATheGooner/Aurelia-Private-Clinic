// @ts-nocheck
/* __next_internal_action_entry_do_not_use__ {"e701fd9ff6bfb8f7c1b598372d42cc9c73fe8aa1":"logoutAction"} */ import { registerServerReference } from "private-next-rsc-server-reference";
import { encryptActionBoundArgs, decryptActionBoundArgs } from "private-next-rsc-action-encryption";
import { redirect } from "next/navigation";
import { revokeCurrentSession } from "@/lib/auth/session";
export async function logoutAction() {
    await revokeCurrentSession();
    redirect("/login");
}
import { ensureServerEntryExports } from "private-next-rsc-action-validate";
ensureServerEntryExports([
    logoutAction
]);
registerServerReference("e701fd9ff6bfb8f7c1b598372d42cc9c73fe8aa1", logoutAction);
