"use client" 
 
import * as applicantClient from "@/lib/actions/applicant/applicant.action"
import { toast } from "sonner";

 export  const downloadResume = async (applicantId: number, applicantName: string)=> {

     try {
        //The browser receives the file as binary data and stores it in a Blob.
        const fileBlob = await applicantClient.downloadApplicantResume(applicantId);

        //Create a temporary URL because a blob cannot be downloaded directly,
        const blobUrl = window.URL.createObjectURL(fileBlob)

        //Create an invisible link and Tell the link where the file is
        const hiddenAnchor = document.createElement('a')
        hiddenAnchor.href = blobUrl;
        
        hiddenAnchor.setAttribute('download', `resume_applicant_${applicantId}_${applicantName}.pdf`);
        
        //Append to document, trigger the download action, and clean up memory
        document.body.appendChild(hiddenAnchor)
        hiddenAnchor.click();
        
        document.body.removeChild(hiddenAnchor)
        window.URL.revokeObjectURL(blobUrl); 

    } catch (error) {
        toast.message("Download Resume Failed")
    }
  }

 export const downloadCVForm = async (applicantId: number, applicantName: string)=> {

    try {
        //The browser receives the file as binary data and stores it in a Blob.
        const fileBlob = await applicantClient.downloadApplicantCVForm(applicantId);

        //Create a temporary URL because a blob cannot be downloaded directly,
        const blobUrl = window.URL.createObjectURL(fileBlob)

        //Create an invisible link and Tell the link where the file is
        const hiddenAnchor = document.createElement('a')
        hiddenAnchor.href = blobUrl;
        
        hiddenAnchor.setAttribute('download', `cvform_applicant_${applicantId}_${applicantName}.pdf`);
        
        //Append to document, trigger the download action, and clean up memory
        document.body.appendChild(hiddenAnchor)
        hiddenAnchor.click();
        
        document.body.removeChild(hiddenAnchor)
        window.URL.revokeObjectURL(blobUrl); 

    } catch (error) {
        toast.message("Download CV Form Failed")
    }

  }