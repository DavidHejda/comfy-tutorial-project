const Airtable = require('airtable');

exports.handler = async (event, context) => {
  const base = new Airtable({
    apiKey: process.env.REACT_APP_AIRTABLE_COMFY_PRODUCTS_TOKEN,
  }).base(process.env.REACT_APP_AIRTABLE_BASE_ID);
  const table = base(process.env.REACT_APP_TABLE);

  let records = [];
  let products;

  try {
    await table.select().eachPage((rows, fetchNextPage) => {
      records = [...records, ...rows];
      fetchNextPage();
    });

    products = records.map((record) => {
      return {
        id: record.id,
        name: record.fields.name,
        featured: record.fields.featured,
        price: record.fields.price,
        colors: record.fields.colors,
        company: record.fields.company,
        description: record.fields.description,
        category: record.fields.category,
        shipping: record.fields.shipping,
        image: record.fields.images[0].url,
      };
    });
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve records' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};

//#########airtable-node#########
// const dotenv = require('dotenv');
// dotenv.config();

// const Airtable = require('airtable-node');
// const airtable = new Airtable({
//   apiKey: process.env.REACT_APP_AIRTABLE_COMFY_PRODUCTS_TOKEN,
// })
//   .base(process.env.REACT_APP_AIRTABLE_BASE_ID)
//   .table(process.env.REACT_APP_TABLE);

// exports.handler = async (event, context, cb) => {
//   try {
//     const response = await airtable.list({ maxRecords: 200 });
//     console.log('#######');
//     console.log(response);
//     console.log('#######');

//     return {
//       statusCode: 200,
//       body: 'products route',
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: 'There was an error',
//     };
//   }
// };
