// export default function(x) {
function constant(x) {
        return function() {
      return x;
    };
  }