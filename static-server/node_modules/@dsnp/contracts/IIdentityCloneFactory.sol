// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

/**
 * @dev DSNP Identity Factory Interface for creating identities via [EIP 1167](https://eips.ethereum.org/EIPS/eip-1167)
 */
interface IIdentityCloneFactory {
    /**
     * @dev event to log the created proxy contract address
     */
    event ProxyCreated(address addr);

    /**
     * @dev Creates a new identity with the message sender as the owner
     * @dev [EIP 1167](https://eips.ethereum.org/EIPS/eip-1167) Proxy
     * @param logic The address to use for the logic contract
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createCloneProxy(address logic) external returns (address);

    /**
     * @dev Creates a new identity with the ecrecover address as the owner
     * @dev [EIP 1167](https://eips.ethereum.org/EIPS/eip-1167) Proxy
     * @param logic The address to use for the logic contract
     * @param owner The initial owner's address of the new contract
     *
     * @dev This MUST emit ProxyCreated with the address of the new proxy contract
     * @return The address of the newly created proxy contract
     */
    function createCloneProxyWithOwner(address logic, address owner) external returns (address);
}
