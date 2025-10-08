import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CreateTeamModal } from "@/components/create-team-modal"
import { useTeamsStore } from "@/lib/store/teams-store"
import jest from "jest" // Declared jest variable

// Mock the store
jest.mock("@/lib/store/teams-store")

describe("CreateTeamModal", () => {
  const mockCreateTeam = jest.fn()
  const mockOpen = true
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTeamsStore as unknown as jest.Mock).mockReturnValue({
      createTeam: mockCreateTeam,
    })
  })

  it("should render the modal when open", () => {
    render(<CreateTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByRole("dialog", { name: /create new team/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/team name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/team code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/team email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/entity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/manager name/i)).toBeInTheDocument()
  })

  it("should show validation errors for empty required fields", async () => {
    const user = userEvent.setup()
    render(<CreateTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} />)

    const submitButton = screen.getByRole("button", { name: /create team/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/team name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/team code is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })
  })

  it("should validate team code format", async () => {
    const user = userEvent.setup()
    render(<CreateTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} />)

    const codeInput = screen.getByLabelText(/team code/i)
    await user.type(codeInput, "invalid-code")

    const submitButton = screen.getByRole("button", { name: /create team/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/team code must contain only uppercase letters, numbers, and hyphens/i),
      ).toBeInTheDocument()
    })
  })

  it("should validate email format", async () => {
    const user = userEvent.setup()
    render(<CreateTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} />)

    const emailInput = screen.getByLabelText(/team email/i)
    await user.type(emailInput, "invalid-email")

    const submitButton = screen.getByRole("button", { name: /create team/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it("should show validation icons when fields are valid", async () => {
    const user = userEvent.setup()
    render(<CreateTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} />)

    const nameInput = screen.getByLabelText(/team name/i)
    await user.type(nameInput, "Valid Team Name")

    const codeInput = screen.getByLabelText(/team code/i)
    await user.type(codeInput, "VALID-001")

    await waitFor(() => {
      const validationIcons = screen.getAllByTestId("validation-success-icon")
      expect(validationIcons.length).toBeGreaterThan(0)
    })
  })

  it("should submit form with valid data", async () => {
    const user = userEvent.setup()
    mockCreateTeam.mockResolvedValue(undefined)

    render(<CreateTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} />)

    // Fill in all required fields
    await user.type(screen.getByLabelText(/team name/i), "Test Team")
    await user.type(screen.getByLabelText(/team code/i), "TEST-001")
    await user.type(screen.getByLabelText(/description/i), "This is a test team description")
    await user.type(screen.getByLabelText(/team email/i), "test@example.com")
    await user.type(screen.getByLabelText(/manager name/i), "John Doe")

    // Select entity
    const entitySelect = screen.getByRole("combobox", { name: /entity/i })
    await user.click(entitySelect)
    const entityOption = await screen.findByRole("option", { name: /entity a/i })
    await user.click(entityOption)

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create team/i })
    await user.click(submitButton)

    // Confirm in confirmation modal
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /confirm creation/i })).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole("button", { name: /yes, create/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(mockCreateTeam).toHaveBeenCalledWith({
        name: "Test Team",
        code: "TEST-001",
        description: "This is a test team description",
        email: "test@example.com",
        entity: "Entity A",
        manager: {
          name: "John Doe",
          avatar: "/placeholder-user.jpg",
        },
      })
    })
  })

  it("should have proper ARIA attributes", () => {
    render(<CreateTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} />)

    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-labelledby")
    expect(dialog).toHaveAttribute("aria-describedby")

    const form = screen.getByRole("form")
    expect(form).toBeInTheDocument()

    const requiredInputs = screen.getAllByRole("textbox", { required: true })
    requiredInputs.forEach((input) => {
      expect(input).toHaveAttribute("aria-required", "true")
    })
  })
})
