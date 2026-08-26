import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { OWNER_EMAIL } from "../owner-auth";
import OwnerDashboard from "./OwnerDashboard";
import styles from "./owner.module.css";

export const dynamic = "force-dynamic";

export default async function OwnerPage(){
  const user=await requireChatGPTUser("/owner");
  const authorized=user.email.trim().toLowerCase()===OWNER_EMAIL;

  if(!authorized){
    return <main className={styles.accessPage}><section className={styles.accessCard}><img src="/shruti-estate-logo.png" alt="Shruti Estate Consultant"/><p className={styles.kicker}>Restricted area</p><h1>Owner access only</h1><p>You signed in as <strong>{user.email}</strong>. This account is not authorized to manage the website.</p><a className={styles.primaryLink} href={chatGPTSignOutPath("/owner")}>Sign out and use the owner account</a><a className={styles.secondaryLink} href="/">Return to public website</a></section></main>;
  }

  return <OwnerDashboard ownerName={user.fullName??"Satyam"} ownerEmail={user.email} signOutPath={chatGPTSignOutPath("/")}/>;
}
