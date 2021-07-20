// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import "./IIdentityBeaconFactory.sol";
import "./IdentityBeaconProxy.sol";
import "./Identity.sol";
import "./IRegistry.sol";

contract BeaconFactory is IIdentityBeaconFactory {
    address private immutable defaultBeacon;
    address private immutable registry;

    constructor(address _beaconAddr, address _registry) {
        defaultBeacon = _beaconAddr;
        registry = _registry;
    }

    /**
     * @return The current beacon contract suggested by this factory
     */
    function getBeacon() external view override returns (address) {
        return defaultBeacon;
    }

    /**
     * @dev Creates a new identity with the message sender as the owner
     *      Uses the beacon defined by getBeacon()
     * @return The address of the newly created Identity
     */
    function createBeaconProxy() external override returns (address) {
        // Effects
        IdentityBeaconProxy proxy = new IdentityBeaconProxy();
        emit ProxyCreated(address(proxy));

        // Interactions
        proxy.initialize(defaultBeacon, msg.sender);

        return address(proxy);
    }

    /**
     * @dev Creates a new identity with the message sender as the owner
     * @param beacon The beacon address to use for identity creation
     *
     * @return The address of the newly created Identity
     */
    function createBeaconProxy(address beacon) external override returns (address) {
        // Effects
        IdentityBeaconProxy proxy = new IdentityBeaconProxy();
        emit ProxyCreated(address(proxy));

        // Interactions
        proxy.initialize(beacon, msg.sender);

        return address(proxy);
    }

    /**
     * @dev Creates a new identity with the ecrecover address as the owner
     * @param beacon The beacon address to use logic contract resolution
     * @param owner The initial owner's address of the new contract
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createBeaconProxyWithOwner(address beacon, address owner)
        external
        override
        returns (address)
    {
        return createProxy(beacon, owner);
    }

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
    ) external override {
        address addr = createProxy(beacon, owner);

        // Now register the new contract under the provided handle.
        IRegistry registryContract = IRegistry(registry);
        registryContract.register(addr, handle);
    }

    /**
     * @dev Creates a new identity with the ecrecover address as the owner
     * @param beacon The beacon address to use logic contract resolution
     * @param owner The initial owner's address of the new contract
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createProxy(address beacon, address owner) private returns (address) {
        // Effects
        IdentityBeaconProxy proxy = new IdentityBeaconProxy();
        emit ProxyCreated(address(proxy));

        // Interactions
        proxy.initialize(beacon, owner);

        return address(proxy);
    }
}
