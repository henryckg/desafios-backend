export const loggerTester = (req, res) => {
    req.logger.fatal('This is Fatal')
    req.logger.error('This is Error')
    req.logger.warning('This is Warning');
    req.logger.info('This is Info');
    req.logger.http('This is Http');
    req.logger.debug('This is Debug');
    res.send({message: 'Testing Logs'});
}