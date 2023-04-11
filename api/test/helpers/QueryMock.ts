interface QueryMock {
    getQuery: () => {
        (): any;
        new(): any;
        _id: string;
    };
}

export const getFindOneMock = (returnObject: {}, id: string): Function => ((query: QueryMock) => {
    expect(query.getQuery()).toMatchSnapshot('findById query');

    if (query.getQuery()._id === id) {
        return returnObject;
    }
});