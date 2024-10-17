# SpendSmart - Personal Finance Management Tool



## Overview
SpendSmart is a comprehensive web application designed to help users track their income, expenses, and monitor their financial balance. Built with React and Firebase, it offers real-time data synchronization and a user-friendly interface for managing personal finances effectively.

## Features
- **User Authentication**: Secure login and registration system using Firebase Authentication
- **Real-time Data Management**: Instant updates and synchronization of financial data
- **Transaction Management**:
  - Add new income and expense entries
  - Edit existing transactions
  - Delete unwanted entries
  - Categorize transactions
- **Financial Analytics**:
  - Visual representation of spending patterns
  - Income vs. Expenses comparison charts
  - Monthly/yearly financial summaries
- **Responsive Design**: Seamless experience across all device sizes
- **Data Security**: Secure storage and retrieval of financial data

## Technologies Used
- **Frontend**: React.js, Ant Design
- **Backend**: Firebase
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Styling**: CSS3, Ant Design components
- **Charts**: Ant Design Charts

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/spendsmart.git
cd spendsmart
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
- Create a Firebase project
- Copy your Firebase configuration
- Create a `.env` file in the root directory
- Add your Firebase config:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm start
```

## Project Structure
```
spendsmart/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   └── Charts/
│   ├── context/
│   ├── firebase/
│   ├── hooks/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Key Features Implementation

### Authentication
```jsx
// Example of Firebase Authentication implementation
import { auth } from '../firebase/config';

const signIn = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // Handle successful sign-in
  } catch (error) {
    // Handle errors
  }
};
```

### Transaction Management
```jsx
// Example of adding a new transaction
const addTransaction = async (transactionData) => {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.collection('transactions').add({
      ...transactionData,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
};
```

## User Guide

### Adding Transactions
1. Click the "Add Transaction" button
2. Fill in the transaction details:
   - Amount
   - Type (Income/Expense)
   - Category
   - Date
   - Description (optional)
3. Submit the form

### Viewing Reports
1. Navigate to the Dashboard
2. Select the desired time period
3. View various charts and statistics
4. Export reports if needed

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Contact
Name - yeddulamadhu6@gmail.com
Project Link: https://github.com/ymadhumohanreddy/Spend-Smart.git

## Acknowledgments
- Ant Design for the UI components
- Firebase for backend services
- React community for inspiration and resources
