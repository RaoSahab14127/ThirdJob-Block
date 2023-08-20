// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceContract {
    address public owner;
    
    enum OrderStatus { Created, Approved, Completed }
    
    struct Order {
        uint256 id;
        address client;
        address freelancer;
        uint256 amount;
        OrderStatus status;
    }
    
    mapping(uint256 => Order) public orders;
    
    mapping(uint256 => bool) public orderExists;
    
    event OrderPlaced(uint256 orderId, address indexed client, uint256 amount);
    event OrderApproved(uint256 orderId);
    event OrderCompleted(uint256 orderId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function placeOrder(address _freelancer, uint256 _id) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        Order memory newOrder = Order({
            id: _id,
            client: msg.sender,
            freelancer: _freelancer,
            amount: msg.value,
            status: OrderStatus.Created
        });
        
        orders[_id] = newOrder;
        orderExists[newOrder.id] = true;
        
        emit OrderPlaced(newOrder.id, msg.sender, msg.value);
    }
    function orderss(uint256 _id) public view  returns( OrderStatus) {
        return (orders[_id].status);
    }
    function approveOrder(uint256 _orderId) external {
        require(orderExists[_orderId], "Order does not exist");
        require(msg.sender == orders[_orderId].client || msg.sender == orders[_orderId].freelancer, "Only client or freelancer can approve");
        require(orders[_orderId].status == OrderStatus.Created, "Order is not in the correct state for approval");
        
        orders[_orderId].status = OrderStatus.Approved;
        
        emit OrderApproved(_orderId);
    }
    
    function completeOrder(uint256 _orderId) external {
        require(orderExists[_orderId], "Order does not exist");
        require(msg.sender == orders[_orderId].client || msg.sender == orders[_orderId].freelancer, "Only client or freelancer can complete");
        require(orders[_orderId].status == OrderStatus.Approved, "Order is not in the correct state for completion");
        
        orders[_orderId].status = OrderStatus.Completed;
        
        // Transfer funds to freelancer
        address payable freelancer = payable(orders[_orderId].freelancer);
        freelancer.transfer(orders[_orderId].amount);
        
        emit OrderCompleted(_orderId);
    }
}
