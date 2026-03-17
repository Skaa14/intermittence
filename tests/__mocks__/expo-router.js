const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

module.exports = {
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: "Link",
  __mockPush: mockPush,
  __mockReplace: mockReplace,
  __mockBack: mockBack,
};
