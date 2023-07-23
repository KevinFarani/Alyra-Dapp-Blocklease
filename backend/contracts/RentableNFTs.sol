// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC4907.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract RentableNFTs is ERC4907 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC4907("RentableNFTs", "RNFT") {}

  function getMinted() public view returns(uint) {
    return _tokenIds.current();
  }
  
  function mint(string memory _tokenURI) public {
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, _tokenURI);
  }
}