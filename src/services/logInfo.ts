// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const logInfo = (aboutTopic: string, data?: any): void => {
  switch (aboutTopic) {
    //login
    case "walletConnection":
      //do we want to talk about the wallet/registration/handle relationship?
      console.log(
        "Successfully connect to wallet: " +
          data.walletAddress +
          "\nUsed wallet address to get created registrations:" +
          data.registrations
      );
      break;
    case "registrationSearch":
      //do we want to talk about what the sdk is doing here since the
      // EC is not responsible for this functionality?
      console.log("Searching for available handle: " + data.handle);
      break;
    case "selectedHandle":
      //Do we want to talk about registration -> handle -> etc?
      console.log(
        "You have more than one registration associated with you wallet. You must select one."
      );
      break;
    case "createHandle":
      //This is creating a registration? Why not use that descriptor?
      console.log("Successfully created registration: " + data.uri);
      break;

    //logout
    case "logout":
      console.log("Successfully logged out. Your all data has been reset.");
      break;

    //post
    //how deep do we want to go into explaining each of the things below?

    case "postActivityContentSaved":
      console.log("Post activity content saved: " + data.note);
      break;
    case "postAnnouncementCreated":
      console.log("Post announcement built and signed: " + data.announcement);
      break;
    case "postBatchCreatedAndPublished":
      console.log(
        "Post batch announcement created and published on chain: " + data.batch
      );
      break;

    //reply
    case "replyActivityContentSaved":
      console.log("activity content saved");
      break;
    case "replyAnnouncementCreated":
      console.log("announcement signed / created");
      break;
    case "replyBatchCreatedAndPublished":
      console.log("batch created/saved");
      break;

    //graph change
    case "graphChangeActivityContentSaved":
      console.log("activity content saved");
      break;
    case "graphChangeAnnouncementCreated":
      console.log("announcement signed / created");
      break;
    case "graphChangeBatchCreatedAndPublished":
      console.log("batch created/saved");
      break;

    //profile updates
    case "profileActivityContentSaved":
      console.log("activity content saved");
      break;
    case "profileAnnouncementCreated":
      console.log("announcement signed / created");
      break;
    case "profileBatchCreatedAndPublished":
      console.log("batch created/saved");
      break;

    //batch publication notification sent to chain
    case "batchPublicationActivityContentSaved":
      console.log("activity content saved");
      break;
    case "batchPublicationAnnouncementCreated":
      console.log("announcement signed / created");
      break;
    case "BatchCreatedAndPublished":
      console.log("batch created/saved");
      break;
    case "batchPublicationToChain":
      console.log("batch publication notification sent to chain");
      break;

    default:
      console.error("Incorrect logging parameter.");
  }
};
