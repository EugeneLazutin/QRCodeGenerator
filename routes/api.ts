import express, { Request, Response } from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req: Request, res: Response) {
    res.send({ message: 'respond with a resource' });
});

module.exports = router;
