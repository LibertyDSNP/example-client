// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

/**
 * @dev DSNP Identity Factory Interface for creating beacon following identities
 */
interface IIdentityBeaconFactory {
    /**
     * @dev event to log the created proxy contract address
     */
    event ProxyCreated(address addr);

    /**
     * @dev This MUST NOT be upgradable by the owner of the factory
     *
     * @return The current beacon contract suggested by this factory
     */
    function getBeacon() external view returns (address);

    /**
     * @dev Creates a new identity with the message sender as the owner
     *      Uses the beacon defined by getBeacon()
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createBeaconProxy() external returns (address);

    /**
     * @dev Creates a new identity with the message sender as the owner
     * @param beacon The beacon address to use for logic contract resolution
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createBeaconProxy(address beacon) external returns (address);

    /**
     * @dev Creates a new identity with the ecrecover address as the owner
     * @param beacon The beacon address to use logic contract resolution
     * @param owner The initial owner's address of the new contract
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createBeaconProxyWithOwner(address beacon, address owner) external returns (address);

    /**
     * @dev Creates a new identity with the address as the owner and registers it with a handle
     * @param beacon The beacon address to use logic contract resolution
     * @param owner The initial owner's address of the new contract
     * @param handle The handle the new identity proxy under which should be registered
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @dev This must revert if registration reverts
     */
    function createAndRegisterBeaconProxy(
        address beacon,
        address owner,
        string calldata handle
    ) external;
}
