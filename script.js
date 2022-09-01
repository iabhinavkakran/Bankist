'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const wholeBalance = document.querySelector('.balance');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Creating username
const createUsername = function (accounts) {
  accounts.forEach(user => {
    //console.log(user.owner);
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(val => val[0])
      .join('');
  });
};
createUsername(accounts);

// Updating UI

const updateUI = function (currentUser) {
  displaySummary(currentUser);

  displayBalance(currentUser);

  movementsDisplay(currentUser);
  inputCloseUsername.value = inputClosePin.value = '';
};

// Display Movements
const movementsDisplay = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  movs.forEach(function (mov, i) {
    const date = new Date(account.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type} ">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}₹</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//movementsDisplay(account1.movements);

// Display Balance
const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}₹`;
};
//displayBalance(account1.movements);

// Display Summary
const displaySummary = function (account) {
  const deposits = account.movements.filter(mov => mov > 0);
  const withdrawals = account.movements.filter(mov => mov < 0);
  const interest = deposits
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  labelSumIn.textContent = `${Math.floor(
    deposits.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2)}₹`;
  labelSumOut.textContent = `${Math.abs(
    withdrawals.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2)}₹`;
  labelSumInterest.textContent = `${interest}₹`;
};
//displaySummary(movements);

// Global Variables
let currentUser, timer;

// Faking Login
// currentUser = account1;
// updateUI(currentUser);
// containerApp.style.opacity = 100;

// display Timer
const startTimerClock = function () {
  let time = 300;

  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Time is Up, Login Again!`;
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Login
const login = function (account) {
  btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    if (
      (currentUser = account.find(
        mov => mov.username === inputLoginUsername.value
      ))
    ) {
      if (currentUser.pin === Number(inputLoginPin.value)) {
        containerApp.style.opacity = 100;
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        labelWelcome.textContent = `Welcome Back, ${
          currentUser.owner.split(' ')[0]
        }`;
        // Starting Timer Clock
        if (timer) clearInterval(timer);
        timer = startTimerClock();

        // Updating UI
        updateUI(currentUser);
      } else {
        console.log('Wrong Password!');
      }
    } else {
      console.log(`Username "${inputLoginUsername.value}" is not found.`);
    }
  });
  // Date Functionality
  const now = new Date();
  const date = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;
};
login(accounts);

// Closing Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentUser.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// Transfer Amount to another Account
const transfer = function (accounts) {
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    let transferUser;
    if (
      (transferUser = accounts.find(
        mov => mov.username === inputTransferTo.value
      ))
    ) {
      if (
        inputTransferAmount.value > 0 &&
        currentUser.balance > inputTransferAmount.value &&
        transferUser &&
        transferUser.username != currentUser.username
      ) {
        transferUser.movements.push(Number(inputTransferAmount.value));
        currentUser.movements.push(-Number(inputTransferAmount.value));
        currentUser.movementsDates.push(new Date().toISOString());
        transferUser.movementsDates.push(new Date().toISOString());
        inputTransferTo.value = inputTransferAmount.value = '';
        inputTransferAmount.blur();
        labelWelcome.textContent = `Amount transfered successfully to, ${
          transferUser.owner.split(' ')[0]
        }`;
        updateUI(currentUser);

        // Reset Timer
        clearInterval(timer);
        timer = startTimerClock();
      } else {
        console.log('Please Enter correct amount');
      }
    } else {
      console.log('Wrong username entered');
    }
  });
};
transfer(accounts);

// Loan Functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov > amount * 0.1)) {
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    updateUI(currentUser);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    // Reset Timer
    clearInterval(timer);
    timer = startTimerClock();
  } else {
    console.log(`Can not provide you the ${amount}`);
  }
});

// Sort Functionality
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  movementsDisplay(currentUser, !sorted);
  sorted = !sorted;
});

// Coding Challenge 1

// Date 1
const dogsJulia1 = [3, 5, 2, 12, 7];
const dogsKate1 = [4, 1, 15, 8, 3];

// Data 2
const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const newDogsJulia = dogsJulia.slice(1, -2);
  const dogsArr = newDogsJulia.concat(dogsKate);
  dogsArr.forEach(function (dog, i) {
    const type = dog > 3 ? 'is an adult' : 'is still a puppy';
    console.log(`Dog number ${i + 1}  ${type}, and is ${dog} years old"`);
  });
};
// checkDogs(dogsJulia1, dogsKate1);
// checkDogs(dogsJulia2, dogsKate2);

// Coding Challenge #2

const calcAverageHumanAge = function (dogsAge) {
  const humanAge = dogsAge.map(age => {
    return age <= 2 ? 2 * age : 16 + age * 4;
  });
  const adultAge = humanAge.filter(age => age >= 18);
  const avgAdultAge = Math.floor(
    adultAge.reduce((acc, age) => acc + age, 0) / adultAge.length
  );
  console.log(avgAdultAge);
};
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Coding Challenge #3

const calcAverageHumanAgeChaining = function (dogsAge) {
  const humanAge = Math.floor(
    dogsAge
      .filter(mov => mov > 2)
      .map(mov => 16 + mov * 4)
      .reduce((acc, mov) => acc + mov, 0) /
      dogsAge.filter(mov => mov > 2).length
  );
  console.log(humanAge);
};
// calcAverageHumanAgeChaining([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAgeChaining([16, 6, 10, 5, 6, 1, 4]);

// Challenges
//const newMap = movements.map(mov => Math.floor(mov * 1.1));
// console.log(movements);
// console.log(newMap);

// const maximum = movements.reduce((acc, cur) => {
//   let max = acc;
//   if (cur > max) {
//     max = cur;
//   }
//   return max;
// }, movements[0]);
// console.log(maximum);

// Flat
//console.log(accounts.flat());

// 1.
// const bankDepositSums = accounts
//   .flatMap(mov => mov.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSums);

// 2.
// const atleastCount1000 = accounts
//   .flatMap(mov => mov.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(atleastCount1000);

// Coding Challenge #4

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// // 1.
// dogs.forEach(
//   dog => (dog.recommendedFood = Math.floor(dog.weight ** 0.75 * 28))
// );
// console.log(dogs);

// //2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(
//   `Sarah dog is eating too ${
//     dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
//   } food.`
// );

// // 3.
// //{ownersEatTooMuch, ownersEatTooLittle}
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);

// // 4.
// // console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// // console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// // 5.
// // console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// // 6.
// // const checkEatingOkay = dog =>
// //   dog.curFood > dog.recommendedFood * 0.9 &&
// //   dog.curFood < dog.recommendedFood * 1.1;
// // console.log(dogs.some(checkEatingOkay));

// // // 7.
// // console.log(dogs.filter(checkEatingOkay));

// // 8.
// // const copyDogs = dogs
// //   .slice()
// //   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// // console.log(copyDogs);

// Clock
// setInterval(() => {
//   const now = new Date();
//   const hour = now.getHours();
//   const min = now.getMinutes();
//   const sec = now.getSeconds();
//   console.log(`${hour}:${min}:${sec}`);
// }, 1000);
