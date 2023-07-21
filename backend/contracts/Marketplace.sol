// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./IERC4907.sol";

/// @title NFTs Rental Marketplace
/// @author Kevin Collorig
/// @notice This contract is a rental marketplace for NFTs implementing ERC4907
/** @dev
    Imports OpenZepplin Counters.sol for easy to use counter
    Imports OpenZepplin EnumerableSet.sol for easy to use array
    Imports OpenZepplin Ownable.sol to be able to easily change contract ownership if required
    Imports OpenZepplin ReentrancyGuard.sol to avoid reentrancy
    Imports OpenZepplin IERC165.sol to check implementation of ERC4907
    Imports OpenZepplin IERC721.sol to interact with classic NFT functions
    Imports OppenZepplin ERC721Holder.sol to allow contract to receive NFTs
    Imports IERC4907.sol to interact with rental NFT functions 
*/
contract Marketplace is Ownable, ReentrancyGuard, IERC721Receiver {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    /// @notice Percentage of fees charged on each rental price 
    uint rentingFeesPercentage = 5;

    // @notice Trace the number of NFTs listed
    Counters.Counter private ListedNFTs;

    /// @notice Representation of an NFT 
    /// @param tokenContract the address of the NFT contract
    /// @param tokenId the ID of the NFT
    struct NFT {
        address tokenContract;
        uint tokenId;
    }

    /// @notice Representation of an NFT listing
    /// @param lender the address of the NFT lender
    /// @param nft the representation of the listed NFT
    /// @param pricePerDay the price of rental per day
    /// @param minRentalDays the minimum days of rental
    /// @param maxRentalDays the maximum days of rental
    struct Listing {
        address lender;
        NFT nft;
        uint pricePerDay;
        uint minRentalDays;
        uint maxRentalDays;
    }

    /// @notice Representation of an NFT booking
    /// @param renter the address of the NFT renter
    /// @param startRentalDate the starting date of rental
    /// @param endRentalDate the ending date of rental
    /// @param earningIndex the index of the earning generated by this booking
    /// @param feesIndex the index of the fees generated by this booking
    /// @dev We use indexes for the earnings and the fees in order to facilitate the access when a booking is cancelled
    struct Booking {
        address renter;
        uint startRentalDate;
        uint endRentalDate;
        uint earningIndex;
        uint feesIndex;
    }

    /// @notice Representation of an earning generated by a booking
    /// @param amount the amount of earning generated
    /// @param redeemableDate the date from which the user can redeem his earning
    /// @param cancelled true if the booking has been cancelled
    /// @param redeemed true if the earning has been redeemed 
    struct Earning {
        uint amount;
        uint redeemableDate;
        bool cancelled;
        bool redeemed;
    }

    /// @notice List of listed contracts
    EnumerableSet.AddressSet private ListedContracts;
    /// @notice Mapping of listed NFTs by contract
    /// @dev NFT Contract address => List of NFT ID
    mapping(address => EnumerableSet.UintSet) private ListedTokensByContract;
    /// @notice Mapping of Listing info by NFT
    /// @dev NFT Contract address => NFT ID => Listing
    mapping(address => mapping(uint => Listing)) private ListingByNFT;
    /// @notice Mapping of Bookings info by NFT
    /// @dev NFT Contract address => NFT ID => Array of Booking
    mapping(address => mapping(uint => Booking[])) private BookingsByNFT;
    /// @notice Mapping of Earnings info by user
    /// @dev User wallet address => Array of Earning
    mapping(address => Earning[]) public EarningsByUser;
    /// @notice Mapping of refunds amount by user
    /// @dev User wallet address => Total refund amount
    mapping(address => uint) public RefundByUser;

    /// @notice Emitted when a new NFT is listed
    event NFTListed(Listing listing);
    /// @notice Emitted when a rental is started
    event NFTRentingStarted(Booking booking);
    /// @notice Emitted when an NFT is booked
    event NFTBooked(Booking booking);
    /// @notice Emitted when an NFT is unlisted
    event NFTUnlisted(Listing listing);
    /// @notice Emitted when an NFT is unbooked
    event NFTUnbooked(Booking[] bookings);
    /// @notice Emitted when funds are sent
    event FundsSent(address beneficiary, uint amount);

    // ------------------------------------------------------------- Getters

    /// @notice Get the renting fees percentage
    /// @return uint The renting fees percentage
    function getRentingFees() public view returns (uint) {
      return rentingFeesPercentage;
    }

    /// @notice Check if an NFT is available for rent at a specific period
    /// @param _nftContract the address of the NFT contract
    /// @param _nftId the ID of the NFT
    /// @param _startRentalDate the starting date of period checking
    /// @param _endRentalDate the ending date of period checking
    /// @return bool true if NFT is available on the checked period
    function checkIsAvailable(
        address _nftContract,
        uint _nftId,
        uint _startRentalDate,
        uint _endRentalDate
    ) public view returns(bool) {
        for (uint i = 0 ; i < BookingsByNFT[_nftContract][_nftId].length ; i++) {
            if (
               (_startRentalDate >= BookingsByNFT[_nftContract][_nftId][i].startRentalDate && _startRentalDate <= BookingsByNFT[_nftContract][_nftId][i].endRentalDate)
            || (_endRentalDate >= BookingsByNFT[_nftContract][_nftId][i].startRentalDate && _endRentalDate <= BookingsByNFT[_nftContract][_nftId][i].endRentalDate)
            || (_startRentalDate < BookingsByNFT[_nftContract][_nftId][i].startRentalDate && _endRentalDate > BookingsByNFT[_nftContract][_nftId][i].endRentalDate)
            ) {
                return false;
            }
        }
        return true;
    }

    /// @notice Get the listed collections
    /// @return address Array of listed collections
    function getListedCollections() public view returns (address[] memory) {
      return EnumerableSet.values(ListedContracts);
    }

    /// @notice Get the listed NFTs ID by collection
    /// @return uint Array of listed NFTs
    function getListedNftsByCollection(
        address _nftContract
    ) public view returns (uint[] memory) {
        return EnumerableSet.values(ListedTokensByContract[_nftContract]);
    }

    /// @notice Get the listing details of an NFT
    /// @return Listing The NFT Listing
    function getListing(
        address _nftContract,
        uint _nftId
    ) public view returns (Listing memory) {
        return ListingByNFT[_nftContract][_nftId];
    }

    /// @notice Get the bookings of an NFT
    /// @return Listing The NFT Bookings
    function getBookings(
        address _nftContract,
        uint _nftId
    ) public view returns (Booking[] memory) {
        return BookingsByNFT[_nftContract][_nftId];
    }

    /// @notice Get all the listings on the marketplace
    /// @return Listing Array of all listings
    function getAllListings() public view returns (Listing[] memory) {
        uint memoryIndexCurrent;
        uint memoryIndexLength = ListedNFTs.current();
        address[] memory listedContracts = EnumerableSet.values(ListedContracts);
        Listing[] memory listings = new Listing[](memoryIndexLength);
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint[] memory nftIds = EnumerableSet.values(ListedTokensByContract[nftContract]);
            for (uint j = 0; j < nftIds.length; j++) {
                uint nftId = nftIds[j];
                listings[memoryIndexCurrent] = ListingByNFT[nftContract][nftId];
                memoryIndexCurrent += 1;
            }
        }
        return listings;
    }

    /// @notice Get all the listings of the caller
    /// @return Listing Array of the listings
    function getMyListings() public view returns (Listing[] memory) {
        uint memoryIndexCurrent;
        uint memoryIndexLength;
        address[] memory listedContracts = EnumerableSet.values(ListedContracts);
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint[] memory nftIds = EnumerableSet.values(ListedTokensByContract[nftContract]);
            for (uint j = 0; j < nftIds.length; j++) {
                uint nftId = nftIds[j];
                if(ListingByNFT[nftContract][nftId].lender == msg.sender) {
                    memoryIndexLength += 1;
                }
            }
        }

        Listing[] memory myListings = new Listing[](memoryIndexLength);
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint[] memory nftIds = EnumerableSet.values(ListedTokensByContract[nftContract]);
            for (uint j = 0; j < nftIds.length; j++) {
                uint nftId = nftIds[j];
                if(ListingByNFT[nftContract][nftId].lender == msg.sender) {
                    myListings[memoryIndexCurrent] = ListingByNFT[nftContract][nftId];
                    memoryIndexCurrent += 1;
                }
            }
        }
        return myListings;
    }

    /// @notice Get all the bookings of the caller
    /// @return Booking Array of the bookings
    function getMyBookings() public view returns (Booking[] memory) {
        uint memoryIndexCurrent;
        uint memoryIndexLength;
        address[] memory listedContracts = EnumerableSet.values(ListedContracts);
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint[] memory nftIds = EnumerableSet.values(ListedTokensByContract[nftContract]);
            for (uint j = 0; j < nftIds.length; j++) {
                uint nftId = nftIds[j];
                Booking[] memory nftBookings = BookingsByNFT[nftContract][nftId];
                for (uint k = 0; k < nftBookings.length; k++) {
                    if(nftBookings[k].renter == msg.sender) {
                        memoryIndexLength += 1;
                    }
                }

            }
        }
        Booking[] memory myBookings = new Booking[](memoryIndexLength);
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint[] memory nftIds = EnumerableSet.values(ListedTokensByContract[nftContract]);
            for (uint j = 0; j < nftIds.length; j++) {
                uint nftId = nftIds[j];
                Booking[] memory nftBookings = BookingsByNFT[nftContract][nftId];
                for (uint k = 0; k < nftBookings.length; k++) {
                    if(nftBookings[k].renter == msg.sender) {
                        myBookings[memoryIndexCurrent] = nftBookings[k];
                        memoryIndexCurrent += 1;
                    }
                }

            }
        }
        return myBookings;
    }

    /// @notice Get all the earnings of the caller
    /// @return Earning[] Array of the earnings
    function getMyEarnings() public view returns (Earning[] memory) {
        return EarningsByUser[msg.sender];
    }

    /// @notice Get refund available of the caller
    /// @return uint The amount of refund available
    function getMyRefund() public view returns (uint) {
        return RefundByUser[msg.sender];
    }

    // ------------------------------------------------------------- Listing Functions

    /// @notice List an NFT on the marketplace
    /// @param _nftContract the address of the NFT contract
    /// @param _nftId the ID of the NFT
    /// @param _pricePerDay the price of rental per day
    /// @param _minRentalDays the minimum days of rental
    /// @param _maxRentalDays the maximum days of rental
    /// @dev The NFT is transferred to the marketplace contract during the listing process
    /** @custom:callcondition
        - NFT to list is implementing ERC4907
        - NFT not already listed
        - Caller is the owner of the NFT
        - NFT has no active User role (ref: ERC4907) at the time of listing
        - Listing details are correctly set
    */
    function listNFT(
        address _nftContract,
        uint _nftId,
        uint _pricePerDay, 
        uint _minRentalDays, 
        uint _maxRentalDays
    ) external {
        require(IERC165(_nftContract).supportsInterface(type(IERC4907).interfaceId), "NFT contract is not ERC4907");
        require(ListingByNFT[_nftContract][_nftId].lender == address(0), "NFT is already listed");
        require(IERC721(_nftContract).ownerOf(_nftId) == msg.sender, "Not the owner of the NFT");
        require(IERC721(_nftContract).isApprovedForAll(msg.sender, address(this)), "Marketplace must be approved on NFT contract");
        require(IERC4907(_nftContract).userOf(_nftId) == address(0), "NFT is already being rented, user role must be available to list");
        require(_pricePerDay > 0, "Rental price should be greater than 0");
        require(_minRentalDays > 0 && _maxRentalDays > 0 && _maxRentalDays >= _minRentalDays, "Invalid rental boundaries");

        _createListing(msg.sender, NFT(_nftContract, _nftId), _pricePerDay, _minRentalDays, _maxRentalDays);

        _safeTransferFromIERC721(_nftContract, _nftId, msg.sender, address(this));
    }

    /// @notice Unlist an NFT from the marketplace
    /// @param _nftContract the address of the NFT contract
    /// @param _nftId the ID of the NFT
    /// @dev The NFT is transferred back to the original owner during the unlisting process
    /** @custom:callcondition
        - NFT is listed on the marketplace
        - Caller is the original owner of the NFT or the marketplace owner
        - NFT has no active User role (ref: ERC4907) at the time of unlisting
    */
    function unlistNFT(
        address _nftContract,
        uint _nftId
    ) external {
        require(ListingByNFT[_nftContract][_nftId].lender != address(0), "NFT is not listed");
        require(ListingByNFT[_nftContract][_nftId].lender == msg.sender || owner() == msg.sender, "Not authorized to unlist this NFT");
        require(IERC4907(_nftContract).userOf(_nftId) == address(0), "NFT is being rented, wait the end to unlist");
        
        _safeTransferFromIERC721(_nftContract, _nftId, address(this), msg.sender);

        _refundBookings(NFT(_nftContract, _nftId));
        _removeListing(NFT(_nftContract, _nftId));
    }  

    // ------------------------------------------------------------- Renting Functions

    /// @notice Book an NFT for a specific period
    /// @param _nftContract the address of the NFT contract
    /// @param _nftId the ID of the NFT
    /// @param _startRentalDate the starting date of rental | If 0 then take block.timestamp
    /// @param _endRentalDate the ending date of rental
    /// @dev If the user oversent ETH for his bookinf, the difference with rental price is sent back to him
    /** @custom:callcondition
        - NFT is listed on the marketplace
        - Rental details are correctly set
        - NFT is available on desired period
        - Caller sent enough ETH to cover the rental price
    */
    function bookNFT(
        address _nftContract,
        uint _nftId,
        uint _startRentalDate,
        uint _endRentalDate
    ) external payable nonReentrant {
        require(ListingByNFT[_nftContract][_nftId].lender != address(0), "NFT is not listed");
        require(_endRentalDate > block.timestamp, "Rental end date cannot be in the past");
        require(_startRentalDate == 0 || _startRentalDate > block.timestamp, "If filled, rental start date cannot be in the past");
        require(_startRentalDate < _endRentalDate, "Rental start date must be lower than end date");

        _startRentalDate = _startRentalDate == 0 ? block.timestamp : _startRentalDate; 
        uint rentalDays = (_endRentalDate - _startRentalDate)/60/60/24 + 1;
        require(rentalDays >= ListingByNFT[_nftContract][_nftId].minRentalDays && rentalDays <= ListingByNFT[_nftContract][_nftId].maxRentalDays , "Rental period must be greater than minimum rental period and lower than maximum rental period");

        require(checkIsAvailable(_nftContract, _nftId, _startRentalDate, _endRentalDate), "NFT is not available on that period");

        uint rentalPrice = rentalDays * ListingByNFT[_nftContract][_nftId].pricePerDay;
        require(msg.value >= rentalPrice, "Not enough ETH to cover rental fees");

        uint rentalFees = rentalPrice * rentingFeesPercentage / 100;
        uint rentalEarning = rentalPrice - rentalFees;
        uint earningIndex = _createEarning(ListingByNFT[_nftContract][_nftId].lender, rentalEarning, _startRentalDate);
        uint feesIndex = _createEarning(owner(), rentalFees, _startRentalDate);

        _createBooking(ListingByNFT[_nftContract][_nftId].nft, msg.sender, _startRentalDate, _endRentalDate, earningIndex, feesIndex);

        uint rentalOverpaid = msg.value - rentalPrice;
        if(rentalOverpaid > 0) {
            _sendFunds(msg.sender, rentalOverpaid);
        }
    }

    /// @notice Grant User role on the NFT to the user who booked it
    /// @param _nftContract the address of the NFT contract
    /// @param _nftId the ID of the NFT
    /** @custom:callcondition
        - NFT is listed on the marketplace
        - User role have not been granted yet
        - Caller's booking is active
    */
   function startRentingNFT(
        address _nftContract,
        uint _nftId
    ) external {
        require(ListingByNFT[_nftContract][_nftId].lender != address(0), "NFT is not listed");
        require(IERC4907(_nftContract).userOf(_nftId) == address(0), "Renting already started");
        (uint currentBookingId, bool haveCurrentBooking) = _getCurrentBookingIndex(_nftContract, _nftId);
        require(haveCurrentBooking && BookingsByNFT[_nftContract][_nftId][currentBookingId].renter == msg.sender, "Not your booking period");

        _setUserIERC4907(_nftContract, _nftId, msg.sender, BookingsByNFT[_nftContract][_nftId][currentBookingId].endRentalDate);

        emit NFTRentingStarted(BookingsByNFT[_nftContract][_nftId][currentBookingId]);
    }

    // ------------------------------------------------------------- Redeem Functions

    /// @notice Transfer the available earnings generated by rentals to the user
    /** @custom:callcondition
        - Caller have available earnings
    */
    function redeemEarnings() external {        
        uint earningsToRedeem;
        for (uint i = 0 ; i < EarningsByUser[msg.sender].length ; i++) {
            if (
               EarningsByUser[msg.sender][i].redeemableDate <= block.timestamp 
            && !EarningsByUser[msg.sender][i].cancelled 
            && !EarningsByUser[msg.sender][i].redeemed
            ) {
                earningsToRedeem += EarningsByUser[msg.sender][i].amount;
                EarningsByUser[msg.sender][i].redeemed = true;
            }
        }

        if(earningsToRedeem > 0) {
            _sendFunds(msg.sender, earningsToRedeem);
        } else {
            revert("Nothing to redeem");
        }
    }

    /// @notice Transfer the available refunds generated by cancelled bookings to the user
    /** @custom:callcondition
        - Caller have available refunds
    */
    function redeemRefund() external {
        require(RefundByUser[msg.sender] > 0, "Nothing to redeem");
        
        uint refundToRedeem = RefundByUser[msg.sender];
        RefundByUser[msg.sender] = 0;
        _sendFunds(msg.sender, refundToRedeem);
    }

    // ------------------------------------------------------------- Helpers

    /// @notice Execute the transfer of funds
    /// @param _beneficiary the address of the beneficiary of the funds
    /// @param _amount the amount of funds to transfer
   function _sendFunds(
        address _beneficiary,
        uint _amount
    ) internal {
        (bool sent,) = _beneficiary.call{value: _amount} ("Success");
        
        emit FundsSent(
            _beneficiary,
            _amount
        );
    }

    /// @notice Get index of the active booking
    /// @param _nftContract the address of the NFT contract
    /// @param _nftId the ID of the NFT
    /// @return uint the index of the active booking if there is one
    /// @return bool true if there is an active booking
    function _getCurrentBookingIndex(
        address _nftContract,
        uint _nftId
    ) internal view returns(uint, bool) {
        for (uint i = 0 ; i < BookingsByNFT[_nftContract][_nftId].length ; i++) {
            if (
               BookingsByNFT[_nftContract][_nftId][i].startRentalDate <= block.timestamp 
            && BookingsByNFT[_nftContract][_nftId][i].endRentalDate >= block.timestamp
            ) {
                return(i, true);
            }
        }
        return(0, false);
    }

    /// @notice Execute the listing of an NFT
    /// @param _lender the address of the NFT lender
    /// @param _nft the representation of the NFT
    /// @param _pricePerDay the price of rental per day
    /// @param _minRentalDays the minimum days of rental
    /// @param _maxRentalDays the maximum days of rental
    function _createListing(
        address _lender,
        NFT memory _nft,
        uint _pricePerDay,
        uint _minRentalDays,
        uint _maxRentalDays
    ) internal {
        ListingByNFT[_nft.tokenContract][_nft.tokenId] = Listing(
            _lender,
            NFT(_nft.tokenContract, _nft.tokenId),
            _pricePerDay,
            _minRentalDays,
            _maxRentalDays
        );
        ListedNFTs.increment();
        EnumerableSet.add(ListedTokensByContract[_nft.tokenContract], _nft.tokenId);
        EnumerableSet.add(ListedContracts, _nft.tokenContract);
        emit NFTListed(ListingByNFT[_nft.tokenContract][_nft.tokenId]);
    }

    /// @notice Execute the unlisting of an NFT
    /// @param _nft the representation of the NFT
    function _removeListing(
        NFT memory _nft
    ) internal {
        Listing memory listingRemoved = ListingByNFT[_nft.tokenContract][_nft.tokenId];
        delete ListingByNFT[_nft.tokenContract][_nft.tokenId];
        ListedNFTs.decrement();
        EnumerableSet.remove(ListedTokensByContract[_nft.tokenContract], _nft.tokenId);
        if (EnumerableSet.length(ListedTokensByContract[_nft.tokenContract]) == 0) {
            EnumerableSet.remove(ListedContracts, _nft.tokenContract);
        }
        emit NFTUnlisted(listingRemoved);    
    }

    /// @notice Execute the booking creation
    /// @param _nft the representation of the NFT
    /// @param _renter the address of the NFT renter
    /// @param _startRentalDate the starting date of rental
    /// @param _endRentalDate the ending date of rental
    /// @param _earningIndex the index of the earning generated by this booking
    /// @param _feesIndex the index of the fees generated by this booking
    function _createBooking(
        NFT memory _nft,
        address _renter,
        uint _startRentalDate,
        uint _endRentalDate,
        uint _earningIndex,
        uint _feesIndex
    ) internal {
        BookingsByNFT[_nft.tokenContract][_nft.tokenId].push(Booking(
            _renter,
            _startRentalDate,
            _endRentalDate,
            _earningIndex,
            _feesIndex
        ));

        emit NFTBooked(BookingsByNFT[_nft.tokenContract][_nft.tokenId][BookingsByNFT[_nft.tokenContract][_nft.tokenId].length - 1]);
    }

    /// @notice Execute the earning registration
    /// @param _earner the address of the user
    /// @param _earning the amount of earning generated
    /// @param _redeemableDate the date from which the user can redeem his earning
    /// @return uint the index of the newly created earning
    function _createEarning(
        address _earner,
        uint _earning,
        uint _redeemableDate
    ) internal returns(uint) {
        EarningsByUser[_earner].push(Earning(_earning, _redeemableDate, false, false));
        return EarningsByUser[_earner].length - 1;
    }

    /// @notice Execute the bookings cancellation
    /// @param _nft the representation of the NFT
    function _refundBookings(
        NFT memory _nft
    ) internal {
        for (uint i = 0 ; i < BookingsByNFT[_nft.tokenContract][_nft.tokenId].length ; i++) {
            RefundByUser[BookingsByNFT[_nft.tokenContract][_nft.tokenId][i].renter] += EarningsByUser[ListingByNFT[_nft.tokenContract][_nft.tokenId].lender][BookingsByNFT[_nft.tokenContract][_nft.tokenId][i].earningIndex].amount;
            EarningsByUser[ListingByNFT[_nft.tokenContract][_nft.tokenId].lender][BookingsByNFT[_nft.tokenContract][_nft.tokenId][i].earningIndex].cancelled = true;

            RefundByUser[BookingsByNFT[_nft.tokenContract][_nft.tokenId][i].renter] += EarningsByUser[owner()][BookingsByNFT[_nft.tokenContract][_nft.tokenId][i].feesIndex].amount;
            EarningsByUser[owner()][BookingsByNFT[_nft.tokenContract][_nft.tokenId][i].feesIndex].cancelled = true;
        }
        delete BookingsByNFT[_nft.tokenContract][_nft.tokenId];
    }

    // ------------------------------------------------------------- ERC721/4907

    /// @notice Implementation of the onERC721Received function from ERC721 to receive NFTs on the contract
    /// @param _operator the performer of the NFT transfer
    /// @param _from the origin address of the NFT
    /// @param _tokenId the ID of the transferred NFT
    /// @param _data the data transferred with the NFT
    /// @return value data returned
    /// @dev We do not accept NFTs transferred by other operators than this contract
    /** @custom:callcondition
        - Operator of the transfer is the marketplace contract
    */
    function onERC721Received(
        address _operator, 
        address _from, 
        uint _tokenId, 
        bytes memory _data
    ) external view override returns(bytes4 value) {
        require(_operator == address(this), "NFT must be received through the listing process");
        return 0x150b7a02;
    }

    /// @notice Execute NFT transfer
    /// @param _tokenContract the address of the NFT contract
    /// @param _tokenId the ID of the NFT
    /// @param _from the origin address of the NFT
    /// @param _to the destination address of the NFT
   function _safeTransferFromIERC721(
        address _tokenContract,
        uint _tokenId,
        address _from,
        address _to
    ) internal {
        IERC721(_tokenContract).safeTransferFrom(_from, _to, _tokenId, "");
    }

    /// @notice Execute the granting of User role on the NFT
    /// @param _tokenContract the address of the NFT contract
    /// @param _tokenId the ID of the NFT
    /// @param _user the address of the user to set
    /// @param _expires the expiration date of the User role
   function _setUserIERC4907(
        address _tokenContract,
        uint _tokenId,
        address _user,
        uint _expires
    ) internal {
        IERC4907(_tokenContract).setUser(_tokenId, _user, uint64(_expires));
    }
}