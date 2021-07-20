// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

interface IPublish {
    struct Batch {
        int16 dsnpType;
        string url;
        bytes32 hash;
    }

    /**
     * @dev Log for each batch published
     * @param dsnpType The type of Announcement in the batch file
     * @param dsnpHash The keccak hash of the batch file
     * @param dsnpUrl A url that resolves to the batch file of Announcements
     */
    event DSNPBatchPublication(int16 indexed dsnpType, bytes32 dsnpHash, string dsnpUrl);

    /**
     * @param publications Array of Batch struct to publish
     */
    function publish(Batch[] calldata publications) external;
}
