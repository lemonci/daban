// This will hold our emails in memory
const emails = []

export const addEmail = (data) => emails.push(data)
export const getEmails = () => emails
