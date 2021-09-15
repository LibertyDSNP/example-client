import React from "react";
import { Store } from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

/**
 * Using this to spy on promise functions in Jest
 * this will immediately flush the message queue
 * so all pending promises will be executed
 */
export const flushPromises = (): Promise<any> => {
  return new Promise((resolve) => setImmediate(resolve));
};

/**
 * Force promises in tests to resolve and runs all timers
 * **NOTE:** This function enables fake timers `jest.useFakeTimers()`
 */
export const forcePromiseResolve = async (): Promise<void> => {
  jest.useFakeTimers();
  await act(async () => {
    new Promise((resolve) => setTimeout(resolve, 0));
    jest.runAllTimers();
  });
};

export const componentWithStore = (
  Component: (props: any) => JSX.Element,
  store: Store,
  props: Record<string, unknown> = {}
): JSX.Element => {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Component {...props} />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export const createMockStore = (initialState: unknown): any => {
  return configureStore()(initialState);
};

/**
 * Mock some key functions to fix the test not
 * being a web3 enabled browser. Using this
 * means you may have to mock some return values
 */
export const mockWeb3EnabledBrowser = (): void => {
  jest.mock("../services/ethereum.ts", () => jest.fn());
  jest.mock("../services/ens.js", () => jest.fn());
  jest.mock("../services/env.ts", () => jest.fn());
};

/**
 * Set the mock return values for getParams. Used for
 * mocking URL params
 * @param params the params to mock. **example:** `{ key: value }`
 */
export const mockReactRouterParams = (mockParams: unknown): void => {
  jest.mock("react-router", () => ({
    useParams: jest.fn().mockReturnValue(mockParams),
  }));
};

/**
 * Array of prefabricated first names for use in creating profiles
 */
export const prefabFirstNames = [
  "Tom",
  "Bob",
  "Scott",
  "Duncan",
  "Frank",
  "Elvis",
  "Josh",
  "Kevin",
  "Cathy",
  "Karen",
  "Mary",
  "Beth",
  "Sheril",
  "Mackenzie",
  "Katie",
  "Sarah",
  "Elizabeth",
  "Maria",
];

/**
 * Array of prefabricated last names for use in creating profiles
 */
export const prefabLastNames = [
  "Smith",
  "Peterson",
  "Sullivan",
  "Myers",
  "Cooper",
  "Williams",
  "Carter",
  "Young",
  "Morgan",
  "King",
  "Ward",
  "Foster",
  "Evans",
  "Davis",
  "Turner",
  "Sanchez",
];

/**
 * Generates a different picture everytime
 */
export const randImage = "https://picsum.photos/200/300";

/**
 * An array of prefabricated messages for use in testing content posts.
 */
//I apologize, I had a lot of fun writing these.
export const prefabMessages = [
  "Hello World",
  "My favorite cartoon is Spongebob",
  "2020 is terrible",
  "Go sports team! Dunk the goal!",
  "I am going to the mall tomorrow",
  "Leave me alone I am the grumpiest person",
  "This is the way",
  "Who's on first, what's on Second, I don't know is on third",
  "Beam me up Scotty.",
  "The pizza shop down the street is giving out free donuts. Kinda sketchy",
  "My birthday is comming up in a little under a month!",
  "I want everyone to know that dogs > cats",
  "Hot take: Hotdogs aren't a sandwich, they're a taco",
  // Uncle Iroh quotes
  "It is time for you to look inward, and start asking " +
    "yourself the big questions. Who are you? And what do " +
    "you want?",
  "Sometimes life is like this dark tunnel. You can’t always " +
    "see the light at the end of the tunnel, but if you just " +
    "keep moving, you will come to a better place.",
  // The Tradegdy of Dark Plagueis the Wise
  "Did you ever hear the tragedy of Darth Plagueis the Wise? " +
    "I thought not. It's not a story the Jedi would tell you. " +
    "It's a Sith legend. Darth Plagueis was a Dark Lord of the " +
    "Sith, so powerful and so wise he could use the Force to " +
    "influence the midichlorians to create life... He had such " +
    "a knowledge of the dark side that he could even keep the " +
    "ones he cared about from dying. The dark side of the Force " +
    "is a pathway to many abilities some consider to be unnatural. " +
    "He became so powerful... the only thing he was afraid of was " +
    "losing his power, which eventually, of course, he did. " +
    "Unfortunately, he taught his apprentice everything he knew, " +
    "then his apprentice killed him in his sleep. It's ironic he " +
    "could save others from death, but not himself.",
];
