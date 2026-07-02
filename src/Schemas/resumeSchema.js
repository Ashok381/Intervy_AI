export const resumeSchema = z.object({
    html: z.string().describe("generated resume in html format")
})
 