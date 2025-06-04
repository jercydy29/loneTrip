// APPROACH 1: Manual type only
type LoginForm = { 
  email: string; 
  password: string; 
}

const data = { email: 123, password: true } as LoginForm
// TypeScript is fooled! It thinks this is valid 😱
// But at runtime, your app crashes!

// APPROACH 2: Zod schema + inferred type
const schema = z.object({
  email: z.string(),
  password: z.string()
})
// type LoginForm = z.infer<typeof schema>

// const data = { email: 123, password: true }
// schema.parse(data) // 💥 Throws error: "Expected string, received number"
// // Zod catches the problem at runtime!