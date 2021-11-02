// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const logInfo = (aboutTopic: string, data?: any): void => {
  if (process.env.REACT_APP_SHOW_LOGGING === "false") return;

  const logMessages: Record<string, any> = {
    //login
    walletConnection: ["Successfully connect to wallet: ", data?.walletAddress],
    registrationSearch: ["Searching for available handle: ", data?.handle],
    selectedHandle: [
      "You have more than one registration associated with you wallet: ",
      data?.registrations,
    ],
    createHandle: ["Successfully created registration: ", data?.uri],
    //logout
    logout: ["Successfully logged out.", "All of your data has been reset."],
    //post
    postActivityContentCreated: ["Post activity content created: ", data?.note],
    postActivityContentStored: [
      "Post activity content stored with hash: ",
      data?.hash,
    ],
    postAnnouncementCreated: [
      "Post announcement built and signed: ",
      data?.announcement,
    ],
    //reply
    replyActivityContentCreated: [
      "Reply activity content created: ",
      data?.reply,
    ],
    replyActivityContentStored: [
      "Reply activity content stored with hash: ",
      data?.hash,
    ],
    replyAnnouncementCreated: [
      "Reply announcement built and signed: ",
      data?.announcement,
    ],
    //graph change
    graphChangeAnnouncementCreated: [
      "Graph change announcement built and signed: ",
      data?.announcement,
    ],
    //profile updates
    profileActivityContentStored: [
      "Profile activity content stored with hash: ",
      data?.hash,
    ],
    profileAnnouncementCreated: [
      "Profile announcement built and signed: ",
      data?.announcement,
    ],
    //batch publication
    batchCreated: ["Batch announcement created: ", data?.batch],
    batchPublished: [
      "Batch announcement publishing to chain: ",
      data?.publication,
    ],
  };
  if (logMessages[aboutTopic])
    console.log(logMessages[aboutTopic][0], logMessages[aboutTopic][1]);
};
