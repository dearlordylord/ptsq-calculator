import { Effect } from "effect";

export const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

export const main = Effect.gen(function* () {
  const greeting = greet("PTSQ Calculator");
  yield* Effect.log(greeting);
  return greeting;
});

if (import.meta.url === `file://${process.argv[1]}`) {
  Effect.runPromise(main).catch(console.error);
}