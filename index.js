const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('enterUser');
});

app.get('/profile', async (req, res) => {
  const username = req.query.username;

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              contestBadge {
                    name
                    expired
                    hoverText
                    icon
                }
                username
                githubUrl
                linkedinUrl
              profile {
                    ranking
                    userAvatar
                    realName
                    aboutMe
                }
              languageProblemCount {
                    languageName
                    problemsSolved
                }
              problemsSolvedBeatsStats {
                    difficulty
                    percentage
                }
              submitStatsGlobal {
                acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
              allQuestionsCount {
                difficulty
                count
            }
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
                topPercentage
                  badge {
                    name
                    icon
                }
            }
            activeDailyCodingChallengeQuestion {
                date
                userStatus
                link
              question {
                    acRate
                    difficulty
                    frontendQuestionId: questionFrontendId
                    status
                    title
                topicTags {
                        name
                    }
                }
            }
        }
        `,
        variables: {
          username: username,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const response2 = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }
        `,
        variables: {
          username: username,
          limit:7,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const userData = response.data.data;
    const pastSubmission = response2.data.data;
    // const submissions = response2.data.data.recentAcSubmissionList;


    // const convertedTimestamps = [];

    // submissions.forEach(submission => {
    //   const timestamp = submission.timestamp;
    //   const date = new Date(timestamp * 1000);
    //   const timeDifference = Date.now() - date.getTime();
    
    //   if (timeDifference < 24 * 60 * 60 * 1000) {
    //     const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    //     convertedTimestamps.push(`${hoursAgo} hours ago`);
    //   } else {
    //     const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    //     convertedTimestamps.push(`${daysAgo + 1} days ago`);
    //   }
    // });

    // console.log(convertedTimestamps);

    res.render('profile', { userData, pastSubmission });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
