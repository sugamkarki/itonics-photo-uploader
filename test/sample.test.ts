function add(a: number, b: number) {
  return a + b;
}
describe("The UserController", () => {
  it("should add values and return the value", () => {
    expect(add(2, 3)).toBe(5);
  });
  it("should add values and return the object", () => {
    expect({ a: add(2, 3) }).toEqual({ a: 5 });
  });
});
