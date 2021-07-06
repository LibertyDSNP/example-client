// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0 <0.9.0;

/**
 * @dev DSNP Registry Interface
 * @dev Suggested data storage implementation:
 *   uint64 internal currentIdSequenceMarker = 0x1; // Must not start at 0
 *   mapping(string => [id, address]) internal handleToIdAndAddress;
 */
interface IRegistry {
    struct AddressChange {
        uint32 nonce;
        address addr;
        string handle;
    }

    struct HandleChange {
        uint32 nonce;
        string oldHandle;
        string newHandle;
    }

    /**
     * @dev Log when a resolution address is changed
     * @param id The DSNP Id
     * @param addr The address the DSNP Id is pointing at
     * @param handle The actual UTF-8 string used for the handle
     */
    event DSNPRegistryUpdate(uint64 indexed id, address indexed addr, string handle);

    /**
     * @dev Register a new DSNP Id
     * @param addr Address for the new DSNP Id to point at
     * @param handle The handle for discovery
     *
     * MUST reject if the handle is already in use
     * MUST emit DSNPRegistryUpdate
     * MUST check that addr implements IDelegation interface
     * @return id for new registration
     */
    function register(address addr, string calldata handle) external returns (uint64);

    /**
     * @dev Alter a DSNP Id resolution address
     * @param newAddr Original or new address to resolve to
     * @param handle The handle to modify
     *
     * MUST be called by someone who is authorized on the contract
     *      via `IDelegation(oldAddr).isAuthorizedTo(oldAddr, Permission.OWNERSHIP_TRANSFER, block.number)`
     * MUST emit DSNPRegistryUpdate
     * MUST check that newAddr implements IDelegation interface
     */
    function changeAddress(address newAddr, string calldata handle) external;

    /**
     * @dev Alter a DSNP Id resolution address by EIP-712 Signature
     * @param v EIP-155 calculated Signature v value
     * @param r ECDSA Signature r value
     * @param s ECDSA Signature s value
     * @param change Change data containing nonce, new address and handle
     *
     * MUST be signed by someone who is authorized on the contract
     *      via `IDelegation(oldAddr).isAuthorizedTo(ecrecovedAddr, Permission.OWNERSHIP_TRANSFER, block.number)`
     * MUST check that newAddr implements IDelegation interface
     * MUST emit DSNPRegistryUpdate
     */
    function changeAddressByEIP712Sig(
        uint8 v,
        bytes32 r,
        bytes32 s,
        AddressChange calldata change
    ) external;

    /**
     * @dev Alter a DSNP Id handle
     * @param oldHandle The previous handle for modification
     * @param newHandle The new handle to use for discovery
     *
     * MUST NOT allow a registration of a handle that is already in use
     * MUST be called by someone who is authorized on the contract
     *      via `IDelegation(oldHandle -> addr).isAuthorizedTo(ecrecovedAddr, Permission.OWNERSHIP_TRANSFER, block.number)`
     * MUST emit DSNPRegistryUpdate
     */
    function changeHandle(string calldata oldHandle, string calldata newHandle) external;

    /**
     * @dev Alter a DSNP Id handle by EIP-712 Signature
     * @param v EIP-155 calculated Signature v value
     * @param r ECDSA Signature r value
     * @param s ECDSA Signature s value
     * @param change Change data containing nonce, old handle and new handle
     *
     * MUST NOT allow a registration of a handle that is already in use
     * MUST be signed by someone who is authorized on the contract
     *      via `IDelegation(handle -> addr).isAuthorizedTo(ecrecovedAddr, Permission.OWNERSHIP_TRANSFER, block.number)`
     * MUST emit DSNPRegistryUpdate
     */
    function changeHandleByEIP712Sig(
        uint8 v,
        bytes32 r,
        bytes32 s,
        HandleChange calldata change
    ) external;

    /**
     * @dev Resolve a handle to a DSNP Id and contract address
     * @param handle The handle to resolve
     *
     * rejects if not found
     * @return A tuple of the DSNP Id and the Address of the contract
     */
    function resolveRegistration(string calldata handle) external view returns (uint64, address);

    /**
     * @dev Resolve a handle to a EIP 712 nonce
     * @param handle The handle to resolve
     *
     * rejects if not found
     * @return expected nonce for next EIP 712 update
     */
    function resolveHandleToNonce(string calldata handle) external view returns (uint32);
}
