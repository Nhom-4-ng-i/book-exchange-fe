import { renderHook } from "@testing-library/react-native";

// Mock dependencies
jest.mock("utils/asyncStorage", () => ({
  getData: jest.fn().mockResolvedValue(null),
  storeData: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Import sau khi mock
import { useOnboardingGate } from "@/app/hooks/useOnboardingGate";

describe("useOnboardingGate Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns markDone function", () => {
    const { result } = renderHook(() => useOnboardingGate());
    
    expect(result.current.markDone).toBeDefined();
    expect(typeof result.current.markDone).toBe("function");
  });

  it("hook initializes without errors", () => {
    const { result } = renderHook(() => useOnboardingGate());
    expect(result.current).toBeTruthy();
  });
});

