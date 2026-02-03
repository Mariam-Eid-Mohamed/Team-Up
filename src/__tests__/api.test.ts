import axios from "axios";

jest.mock("axios");

describe("Api instance", () => {
  test("is created with correct baseURL", async () => {
    // Import lazily inside the test so that axios.create is already mocked
    const { default: Api } = await import("@/Services/Api");

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "http://localhost:5001/api",
    });

    const mockedCreate = axios.create as jest.Mock;
    const createdInstance = mockedCreate.mock.results[0]?.value;
    expect(Api).toBe(createdInstance);
  });
});


