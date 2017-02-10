process.stdin.setEncoding('utf8');
console.log('输入长度:');
process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    const r = parseFloat(chunk);
    const cos = Math.cos(1/6*Math.PI);
    const dot1 = `(${(12.5+ r*cos).toFixed(2)} ${((50*(1-cos) + r/2)).toFixed(2)})`;
    const dot2 = `(12.5,${(50*(1-cos) + r).toFixed(2)})`;
    const dot3 = `(12.5 ${(50*(1+cos) - r).toFixed(2)})`;
    const dot4 = `(${(12.5+ r*cos).toFixed(2)},${(50*(1+cos) - r/2).toFixed(2)})`;
    const dot5 = `(${(87.5- r*cos).toFixed(2)} ${(50 + r/2).toFixed(2)})`;
    const dot6 = `(${(87.5- r*cos).toFixed(2)},${(50 - r/2).toFixed(2)})`;

    console.log(dot1);
    console.log(dot2);
    console.log(dot3);
    console.log(dot4);
    console.log(dot5);
    console.log(dot6);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});
