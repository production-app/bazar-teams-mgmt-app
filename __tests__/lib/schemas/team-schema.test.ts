import { teamFormSchema } from "@/lib/schemas/team-schema"

describe("teamFormSchema", () => {
  describe("name validation", () => {
    it("should accept valid team names", () => {
      const result = teamFormSchema.safeParse({
        name: "Valid Team Name",
        code: "VALID-001",
        description: "This is a valid description with enough characters",
        email: "valid@example.com",
        entity: "Entity A",
        managerName: "John Doe",
      })

      expect(result.success).toBe(true)
    })

    it("should reject empty team names", () => {
      const result = teamFormSchema.safeParse({
        name: "",
        code: "VALID-001",
        description: "This is a valid description",
        email: "valid@example.com",
        entity: "Entity A",
        managerName: "John Doe",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("required")
      }
    })

    it("should reject team names shorter than 3 characters", () => {
      const result = teamFormSchema.safeParse({
        name: "AB",
        code: "VALID-001",
        description: "This is a valid description",
        email: "valid@example.com",
        entity: "Entity A",
        managerName: "John Doe",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 3 characters")
      }
    })
  })

  describe("code validation", () => {
    it("should accept valid team codes", () => {
      const validCodes = ["ABC-123", "TEAM-001", "PROJECT-X", "A1B2C3"]

      validCodes.forEach((code) => {
        const result = teamFormSchema.safeParse({
          name: "Valid Team",
          code,
          description: "This is a valid description",
          email: "valid@example.com",
          entity: "Entity A",
          managerName: "John Doe",
        })

        expect(result.success).toBe(true)
      })
    })

    it("should reject team codes with lowercase letters", () => {
      const result = teamFormSchema.safeParse({
        name: "Valid Team",
        code: "invalid-code",
        description: "This is a valid description",
        email: "valid@example.com",
        entity: "Entity A",
        managerName: "John Doe",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("uppercase")
      }
    })

    it("should reject team codes with special characters", () => {
      const result = teamFormSchema.safeParse({
        name: "Valid Team",
        code: "INVALID@CODE",
        description: "This is a valid description",
        email: "valid@example.com",
        entity: "Entity A",
        managerName: "John Doe",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("uppercase")
      }
    })
  })

  describe("email validation", () => {
    it("should accept valid email addresses", () => {
      const validEmails = ["test@example.com", "user.name@example.co.uk", "user+tag@example.com"]

      validEmails.forEach((email) => {
        const result = teamFormSchema.safeParse({
          name: "Valid Team",
          code: "VALID-001",
          description: "This is a valid description",
          email,
          entity: "Entity A",
          managerName: "John Doe",
        })

        expect(result.success).toBe(true)
      })
    })

    it("should reject invalid email addresses", () => {
      const invalidEmails = ["invalid", "invalid@", "@example.com", "invalid@.com"]

      invalidEmails.forEach((email) => {
        const result = teamFormSchema.safeParse({
          name: "Valid Team",
          code: "VALID-001",
          description: "This is a valid description",
          email,
          entity: "Entity A",
          managerName: "John Doe",
        })

        expect(result.success).toBe(false)
      })
    })
  })

  describe("description validation", () => {
    it("should accept valid descriptions", () => {
      const result = teamFormSchema.safeParse({
        name: "Valid Team",
        code: "VALID-001",
        description: "This is a valid description with enough characters to pass validation",
        email: "valid@example.com",
        entity: "Entity A",
        managerName: "John Doe",
      })

      expect(result.success).toBe(true)
    })

    it("should reject descriptions shorter than 10 characters", () => {
      const result = teamFormSchema.safeParse({
        name: "Valid Team",
        code: "VALID-001",
        description: "Short",
        email: "valid@example.com",
        entity: "Entity A",
        managerName: "John Doe",
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 10 characters")
      }
    })
  })
})
