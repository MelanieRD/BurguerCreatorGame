function papa(s) {
  let justNumbers = "";
  let negative = false;
  let finalOut = 0;
  let iterar = true;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "-") {
      negative = true;
    }
    if (!isNaN(s[i]) && parseInt(s[i]) !== 0 && iterar == true) {
      justNumbers += s[i];
      finalOut = parseInt(justNumbers);
    } else if (isNaN(s[i])) {
      if (justNumbers.length === 0) {
        finalOut = 0;
      } else {
        iterar = false;
      }
    }
  }

  if (negative) {
    return finalOut * -1;
  }

  return finalOut;
}

console.log(papa("3570b8"));
