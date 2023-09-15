/**
 * This test only checks the functions used to separate the logic from
 * the HTTP requests and responses. The functions are tested with mock data
 * to ensure they are working properly.
 * As a result of only using the functions, the code coverage is down to 30%.
 * I was unable to see a solution that worked around this, and will unfortunately
 * have to submit it as is.
 * Please do not hesitate to reach out if this is unnacceptable.
 */
const {returnGroceryList, addItem, editItem, deleteItem} = require('../app.js');

const mockList = [
    { id: 1, productName:"Test", price: 9.99, qty: 3, purchased: false }];

describe('API Method Testing', () => {
    test('returnGroceryList should return the groceryList array', () => {
        // Convert array to JSON string to compare for match
        // Arrange and Act
        const expected = JSON.stringify(mockList);
        const result = returnGroceryList(mockList);

        // Assert
        expect(result).toEqual(expected);
    });
    test('addItem should add an item to the groceryList array', () => {
        // Arrange
        const newItem = { id: 2, productName:"Test2", price: 9.99, qty: 3, purchased: false };
        const expected = mockList.length + 1;
        // Act
        addItem(newItem, mockList);
        // Assert
        expect(mockList.length).toEqual(expected);
    });
    test('editItem should edit an item in the groceryList array', () => {
        // Arrange
        const newItem = { id: 1, productName:"Test2", price: 9.99, qty: 3, purchased: false };
        const expected = newItem.productName;
        const index = newItem.id - 1;
        // Act
        editItem(index, newItem, mockList);
        // Assert
        expect(mockList[0].productName).toEqual(expected);
    });
    test('deleteItem should delete an item from the groceryList array', () => {
        // Arrange
        const expected = mockList.length - 1;
        const index = 0;
        // Act
        deleteItem(index, mockList);
        // Assert
        expect(mockList.length).toEqual(expected);
    });
 });