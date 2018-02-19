// .debug is the method exported
exports.debug = function(title, output, level) {
  // If the DEBUG_MODE env is set.
  // If not set when we parseInt() unexpected results
  // would occur.
  if(process.env.DEBUG_MODE) {

    // Is the DEBUG_MODE threshold hit?
    // Environmental Variables come in as strings
    // so if you want to eval them as an int
    // you need to parseInt()
    if (level <= parseInt(process.env.DEBUG_MODE)) {
      
      // Combine the title and output together in a .log
      console.log(title, output);
    }
  }
}
