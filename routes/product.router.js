const express = require('express');
const router = express.Router();
const Products = require('../schemas/products.schema');

//상품 조회 하기 기능 api
router.get('/products', async (req, res) => {
  try {
    const products = await Products.find(
      {},
      '-_id productName writer status createdAt',
    );
    // 내림차순 정렬
    const result = products.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//상품 상세 조회 기능 api (productName detail writer status )
router.get('/products/:productId', async (req, res) => {
  const products = await Products.find(
    {},
    '-_id productId productName detail writer status createdAt',
  );
  const { productId } = req.params;
  const result = products.find(
    (product) => product.productId === Number(productId),
  );
  res.status(200).json({ result });
});

//새로운 상품 작성 api
router.post('/products', async (req, res) => {
  const { productId, productName, detail, writer, password } = req.body;

  const productsID = await Products.find({ productId });
  const productsNAME = await Products.find({ productName });
  const Writer = await Products.find({ writer });

  if (productsID.length) {
    return res.status(400).json({
      success: false,
      errorMessage: '이미 존재하는 Products ID 입니다.',
    });
  } else if (productsNAME.length) {
    return res.status(400).json({
      success: false,
      errorMessage: '이미 존재하는 Products Name 입니다.',
    });
  } else if (Writer.length) {
    return res.status(400).json({
      success: false,
      errorMessage: '이미 존재하는 작성자 입니다.',
    });
  }

  const createProducts = await Products.create({
    productId,
    productName,
    detail,
    writer,
    password,
  });

  res.status(200).json({ products: createProducts });
});

//상품 정보 수정 api
router.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { password, productName, detail, status } = req.body;

  try {
    const existProduct = await Products.findOne({ productId });
    if (existProduct) {
      console.log(existProduct);
      if (password === existProduct.password) {
        await Products.updateOne(
          { productId: productId },
          {
            $set: {
              productName: productName,
              detail: detail,
              status: status,
            },
          },
        );
        res.status(200).json({ success: true });
      } else {
        res
          .status(404)
          .json({ success: false, message: '비밀번호가 일치 하지 않습니다.' });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: '해당 상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 상품 삭제 api
router.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;
  try {
    const existProduct = await Products.findOne({ productId: productId });
    if (existProduct) {
      console.log(existProduct);
      if (password === existProduct.password) {
        await Products.deleteOne({ productId });
        res.status(200).json({ success: true, message: '삭제하였습니다.' });
      } else {
        res
          .status(404)
          .json({ success: false, message: '비밀번호가 일치 하지 않습니다.' });
      }
    } else {
      res
        .status(404)
        .json({ success: false, message: '해당 상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: errorMessage });
  }
});
module.exports = router;
