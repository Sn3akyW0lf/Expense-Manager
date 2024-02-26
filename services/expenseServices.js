const ITEMS_PER_PAGE = 10;

const getExpenses = (req, where) => {

    return req.user.getExpenses({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE
    });
};

module.exports = {
    getExpenses
};