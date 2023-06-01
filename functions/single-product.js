const Airtable = require('airtable-node');

const airtable = new Airtable({
  apiKey: process.env.REACT_APP_AIRTABLE_COMFY_PRODUCTS_TOKEN,
})
  .base(process.env.REACT_APP_AIRTABLE_BASE_ID)
  .table(process.env.REACT_APP_TABLE);

exports.handler = async (event, context, cb) => {
  const { id } = event.queryStringParameters;
  if (id) {
    try {
      let product = await airtable.retrieve(id);
      console.log(product);
      if (product.error) {
        return {
          statusCode: 404,
          body: `No product with id: ${id}`,
        };
      }
      product = { id: product.id, ...product.fields };
      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: 'Server Error',
      };
    }
  }
};
