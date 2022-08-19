'use strict';

const account1 = {
  owner: 'Azaz ali',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Parkha Iftikhar',
  movements: [110, 220, 400, 3000, -250, -100, 1000, 500],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Awais Nisar',
  movements: [760, 880, -200, -500, -110, 3000, 4000, 1000, 200],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sahibzada Ihtisham',
  movements: [150, 700, -300, -500, -330, -100, 1000, -200],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// All DOM elements

const movementContainer = document.querySelector('.movements-container');
movementContainer.innerHTML = ' ';
const currentBalance = document.querySelector('.current-balance');
const login = document.querySelector('.btn-login');
const welcome = document.querySelector('.logIn-heading');
const userInput = document.querySelector('.user-input');
const userPin = document.querySelector('.user-pin');
const mainAppArea = document.querySelector('.main-app-area');
const inLabel = document.querySelector('.in-label');
const outlabel = document.querySelector('.out-label');
const interestlabel = document.querySelector('.interest-label');
const recieverUser = document.querySelector('.transfer-to-input');
const amount = document.querySelector('.amount-input');
const transferBtn = document.querySelector('.transfer-button');
const closeUserInput = document.querySelector('.close-user-input');
const closePinInput = document.querySelector('.close-pin-input');
const closeButton = document.querySelector('.close-btn');
const loanInput = document.querySelector('.loan-input');
const loanBtn = document.querySelector('.loan-button');
const currentDate = document.querySelector('.date');
const timerLabel = document.querySelector('.Timer');
//display movements
const displayMovements = function (movements) {
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposite' : 'withdrawal';
    const formattedMov = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(mov);
    const html = `
  <div class="movement-row">
  <div><p class="${type}">${i + 1} ${type}</p></div>
  <div><span class="deposite-money"> ${formattedMov}  </span></div>
</div>
  `;
    movementContainer.insertAdjacentHTML('afterbegin', html);
  });
};

//display balance

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  currentBalance.textContent = `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(acc.balance)}`;
};

const displayFooter = function (acc) {
  const income = acc.movements
    .filter(move => move > 0)
    .reduce((acc, mov) => acc + mov, 0);
  inLabel.textContent = `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(income)}`;

  const outcome = acc.movements
    .filter(move => move < 0)
    .reduce((acc, mov) => acc + mov, 0);
  outlabel.textContent = `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(outcome))}$`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter((int, i, array) => {
      // console.log(array);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  interestlabel.textContent = `${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(interest)}`;
};
//Create usernames
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

//update UI in one function
const updateUI = function (acc) {
  displayMovements(acc.movements);

  //Display Balance
  displayBalance(acc);

  //display footer
  displayFooter(acc);
};

//set timer
const setTime = function () {
  let time = 600;

  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    timerLabel.textContent = `${min}:${sec}`;

    time--;
    if (time === 0) {
      clearInterval(timer);
      mainAppArea.style.opacity = 0;
      welcome.textContent = 'Log in to get started';
    }
  }, 1000);
};

//Login

let currentAccount;
const num = new Intl.NumberFormat('en-US').format();

login.addEventListener('click', function () {
  currentAccount = accounts.find(acc => acc.username === userInput.value);
  if (currentAccount?.pin === Number(userPin.value)) {
    mainAppArea.style.opacity = 100;
  }

  //Display UI message
  welcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  userInput.value = userPin.value = '';
  userPin.blur();
  //set date

  const now = new Date();
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    weekday: 'long',
  };
  currentDate.textContent = new Intl.DateTimeFormat('en-US', option).format(
    now
  );
  setTime();
  //Display Movements
  updateUI(currentAccount);
});

//transfering
transferBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = Number(amount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === recieverUser.value
  );
  console.log(transferAmount, recieverAccount);
  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    recieverAccount.username !== currentAccount.username
  ) {
    // console.log('valid');
    amount.value = recieverUser.value = '';
    currentAccount.movements.push(-transferAmount);
    recieverAccount.movements.push(transferAmount);
    updateUI(currentAccount);
  }
});
//Request for loan

loanBtn.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('clicked');
  const amount = Number(loanInput.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  loanInput.value = '';
});

//closing account
closeButton.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('click');
  if (
    closeUserInput.value === currentAccount.username &&
    Number(closePinInput.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    accounts.splice(index, 1);
    mainAppArea.style.opacity = 0;
  }
  closeUserInput.value = closePinInput.value = '';
  welcome.textContent = 'Log in to get started';
});

// const frnds = ['pari', 'khan'];
// const frndsTimer = setTimeout(
//   (frnd1, frnd2) => console.log(`aizy khan travelling with ${frnd1} ${frnd2}`),
//   2000,
//   ...frnds
// );
// console.log('waiting');
// if (frnds.includes('pari')) clearTimeout(frndsTimer);

// setInterval(function () {
//   const now = new Date();
//   // console.log(now);
//   const hour = now.getHours();
//   const mint = now.getMinutes();
//   const sec = now.getSeconds();

//   const wow = hour > 12 ? 'PM' : 'AM';
//   const clock = `${hour} : ${mint} : ${sec}: ${wow}`;
//   console.log(clock);
// }, 1000);
