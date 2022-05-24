export { Pair, fst, snd, nTuple, toggle,  left, right }

const Pair = x => y => f => f(x)(y);
const snd = x => y => y;
const fst = x => y => x;

const nTuple = n => [
    (...args) => f => f(args),
    ...Array.from({length:n}, (x,idx) => args => args[idx])
];

const toggle = x => x==1 ? 0 : 1;

const left = (x) => (l) => (r) => l(x);
const right = (x, y) => (l) => (r) => r(x, y);