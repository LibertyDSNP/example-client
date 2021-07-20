// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./IIdentityCloneFactory.sol";
import "./Identity.sol";

contract IdentityCloneFactory is IIdentityCloneFactory {
    using Clones for address;

    /**
     * @dev Creates a new identity with the message sender as the owner
     * @dev [EIP 1167](https://eips.ethereum.org/EIPS/eip-1167) Proxy
     * @param logic The address to use for the logic contract
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createCloneProxy(address logic) public override returns (address) {
        address instance = logic.clone();
        Identity(instance).initialize(msg.sender);
        emit ProxyCreated(instance);
        return instance;
    }

    /**
     * @dev Creates a new identity with the ecrecover address as the owner
     * @dev [EIP 1167](https://eips.ethereum.org/EIPS/eip-1167) Proxy
     * @param logic The address to use for the logic contract
     * @param owner The initial owner's address of the new contract
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createCloneProxyWithOwner(address logic, address owner)
        external
        override
        returns (address)
    {
        address instance = logic.clone();
        emit ProxyCreated(instance);
        Identity(instance).initialize(owner);
        return instance;
    }
}
