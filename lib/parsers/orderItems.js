const { forceArray, transformObjectKeys } = require('../util/transformers');

/**
 * @typedef OrderItem - see https://docs.developer.amazonservices.com/en_UK/orders-2013-09-01/Orders_Datatypes.html#OrderItem
 */

/**
 * @typedef OrderItemsList - a list of OrderItems - see https://docs.developer.amazonservices.com/en_UK/orders-2013-09-01/Orders_Datatypes.html#OrderItem
 */

/**
 * @typedef orderItemsList - the mws-advanced items list
 * @param {orderItems} - array of OrderItem
 * @param {nextToken} - string for next token to provide to calls to ListOrderItemsByNextToken
 * @param {orderId} - string with the Amazon Order ID
 */

/**
 * Transform known integer and bool fields from strings to real integer and boolean
 *
 * @private
 * @param {OrderItem} item - OrderItem
 * @returns {OrderItem} - OrderItem with the quantities parseInt()ed, and bools converted from strings
 */

function transformIntsAndBools(item) {
    const {
        quantityOrdered,
        quantityShipped,
        isGift,
        productInfo,
        ...restItem
    } = item;
    const { numberOfItems, ...restProductInfo } = productInfo;

    return {
        ...restItem,
        isGift: !!(isGift === 'true'),
        quantityOrdered: parseInt(quantityOrdered, 10),
        quantityShipped: parseInt(quantityShipped, 10),
        productInfo: {
            ...restProductInfo,
            numberOfItems: parseInt(numberOfItems, 10),
        },
    };
}
/**
 * Transform MWS OrderItemsList
 *
 * @private
 * @param {OrderItemsList} orderItemsList - mws OrderItemsList
 * @returns {orderItemsList}
 */
const parseOrderItems = (orderItemsList) => {
    const { NextToken: nextToken, AmazonOrderId: orderId } = orderItemsList;
    const arr = forceArray(orderItemsList.OrderItems);
    const orderItems = arr.map(x => transformIntsAndBools(transformObjectKeys(x.OrderItem)));
    const ret = {
        orderItems,
        nextToken,
        orderId,
    };
    return ret;
};

module.exports = parseOrderItems;
