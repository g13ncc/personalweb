-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2024 at 05:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `c237_ca2_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `faq`
--

CREATE TABLE `faq` (
  `questions` longtext NOT NULL,
  `ans` longtext NOT NULL,
  `qid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faq`
--

INSERT INTO `faq` (`questions`, `ans`, `qid`) VALUES
('Can I change the background of this application?', 'Yes! \r\nTo change background of our application, find the purple color \"theme\" button. ', 1),
('Can I change my profile picture?', 'Yes! To change profile picture, simply click on your username in our users list then click the edit button!', 2),
('Can I delete my account?', 'We hate to see you go :( but yes you can. Click on your username on the users list and click on the bin button.', 3),
('tester', 'tester', 4),
('testing', 'testing', 5);

-- --------------------------------------------------------

--
-- Table structure for table `userqn`
--

CREATE TABLE `userqn` (
  `uqid` int(11) NOT NULL,
  `qns` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userqn`
--

INSERT INTO `userqn` (`uqid`, `qns`) VALUES
(1, 'tester'),
(2, 'Can I delete my account?'),
(3, 'hi'),
(4, 'test'),
(5, 'testing');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `account_id` int(10) NOT NULL,
  `username` varchar(10) NOT NULL,
  `password` varchar(8) NOT NULL,
  `dob` date NOT NULL,
  `contact` int(8) NOT NULL,
  `biography` text NOT NULL,
  `profile_pic` varchar(1000) NOT NULL,
  `points` int(3) NOT NULL,
  `likes` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`account_id`, `username`, `password`, `dob`, `contact`, `biography`, `profile_pic`, `points`, `likes`) VALUES
(1, 'tester', 'tester', '2024-07-03', 47832047, 'science', 'app.png', 0, 10),
(2, 'tester2', 'test123', '2024-07-02', 98765432, 'reading', 'maru.png', 40, 5),
(3, 'tester3', 'test123', '2007-01-13', 98789879, 'writing', 'melody.png', 55, 8),
(4, 'tester4', 'pom4', '2006-02-06', 98323473, 'maths', 'pompom.jpg', 1, 16),
(5, 'tester5', 'pocha', '2007-01-13', 9865678, 'programming', 'Pochacco.png', 75, 23),
(6, 'tester6', 'cina', '2014-07-08', 98789879, 'english', 'Cinnamoroll.png', 29, 1),
(7, 'tester7', 'test123', '2015-07-15', 98468182, 'Arts', 'kuromi.png', 100, 99),
(8, 'tester8', 'test123', '2024-04-16', 98765435, 'Engineering ', 'gudetama.jpg', 99, 34);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`qid`);

--
-- Indexes for table `userqn`
--
ALTER TABLE `userqn`
  ADD PRIMARY KEY (`uqid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`account_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `faq`
--
ALTER TABLE `faq`
  MODIFY `qid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userqn`
--
ALTER TABLE `userqn`
  MODIFY `uqid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `account_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
