import React, { Component } from 'react'
import { notification, Input, Form, Modal, Table, Steps, Button, message, Tabs, Card, Popconfirm, Select, Tag, Tooltip, Divider } from 'antd';
import axios from 'axios';
import { DeleteTwoTone, EditTwoTone, CheckOutlined, ArrowLeftOutlined, ArrowRightOutlined, LeftOutlined, IdcardTwoTone, ProfileTwoTone, ContainerTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";
import playerAvatar from '../images/admin.png';
var allocatedTeamsWithCategories = [], bufferPlayersList = [];
var finalTeams = [];
const { Step } = Steps;
const { TabPane } = Tabs;
const { Option } = Select;
const steps = [
    {
        title: 'Choose team size',
        icon: <EditTwoTone />
    },
    {
        title: 'All player\'s details',
        icon: <ProfileTwoTone />
    },
    {
        title: 'Player\'s with roles',
        icon: <ContainerTwoTone />
    },
    {
        title: 'Final teams',
        icon: <IdcardTwoTone />
    },
];
const formItemLayout = {
    labelCol: {
        xs: {
            span: 22,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 22,
        },
        sm: {
            span: 14,
        },
    },
};

export class Stepwiseteam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            playersData: [],
            categories: [],
            categoriesLength: '',
            selectedCategory: "",
            selectedteamLength: '',
            selectedcategoryLength: '',
            totalTeams: '',
            bufferPlayers: '',
            teams: [],
            categorywiseTeamLength: '',
            loggedIn: false,
            rolewiseSortData: [],
            finalcategoryid: [],
            min_max_sr_categories: [],
            categorywisedata: [],
            roles: ['Batsman', 'Bowler', 'All_Rounder', 'Debutant'],
            allcarddata: [],
            teamsData: [],
            setVisible: false,
            setCreationVisible: false,
            addOrUpdateDetails: true,
            noTeamsAvailable:false,
            alldata: {
                category: "", category_length: "", buffer_player: "", created_team_count: "", team_member: "",
            },
            allTeamsWithPlayers: [],
        };
        this.stepwiseteamcreation();
    }

    groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    getMinMax = (category, array, type) => {
        var out = [];
        array.forEach(function (el) {
            return out.push.apply(out, [el[type]]);
        }, []);
        return {
            category: category,
            min: Math.min.apply(null, out),
            max: Math.max.apply(null, out),
            mid_point: (Math.min.apply(null, out) + Math.max.apply(null, out)) / 2,
        };
    };

    descendingSortByProperty(property) {
        return function (a, b) {
            if (a[property] < b[property]) return 1;
            else if (a[property] > b[property]) return -1;
            return 0;
        };
    }

    ascendingSortByProperty(property) {
        return function (a, b) {
            if (a[property] > b[property]) return 1;
            else if (a[property] < b[property]) return -1;
            return 0;
        };
    }

    handlercreate_teamD = async () => {
        var temp = [];
        this.state.teamsData.map((data) => {
            temp = this.calculateTeam(data.category_name, data.team_length);
            this.assignTeams(data.category_name, data.team_length, temp);
        })
    }

    assignTeams = (category, teamLen, temp) => {
        const allteams = [];
        var flag = 0;
        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < temp[i].length; j++) {
                if (temp[i][j][category] == undefined)
                    continue;
                if (temp[i][j][category].length < teamLen)
                    continue;
                allteams.push(temp[i][j])
            }
        }
        for (var i = 0; i < this.state.teams.length; i++) {
            if (category == this.state.teams[i]["category_name"]) {
                const disn = {
                    category: [this.state.teams[i]["category_name"]],
                    team_name: [this.state.teams[i]["team_name"]],
                    players: allteams[flag][category],
                }
                finalTeams.push(disn);
                flag++;
            }
        }
        this.setState({
            allTeamsWithPlayers: finalTeams
        })
    }

    getdataofTeams = () => {
        axios.get("http://localhost:4000/admin/getdataofteams").then((res) => {
            this.setState({
                teamsData: res.data.data
            })
        })
    }

    stepwiseteamcreation = async () => {
        this.getTeams();
        this.getdataofTeams();
        const categoryWisePlayersCount = [];
        const RankWiseData = [];
        var groupByRoles = [];
        let res = await axios.get("http://localhost:4000/admin/stepwiseteamCreation");
        await this.setState({
            playersData: res.data.data,
            categories: res.data.categories,
            finalcategoryid: res.data.finalcategoryid,
        })
        this.state.categories.map((category) => {
            const min_max_batting_strike_rate = this.getMinMax(
                category,
                this.state.playersData[category],
                "batting_strike_rate"
            );
            const min_max_bowling_strike_rate = this.getMinMax(
                category,
                this.state.playersData[category],
                "bowling_strike_rate"
            );
            const min_max_batting_average = this.getMinMax(category, this.state.playersData[category], "batting_avg");
            this.state.min_max_sr_categories.push({
                category: category,
                min_batting_strike_rate: min_max_batting_strike_rate.min,
                max_batting_strike_rate: min_max_batting_strike_rate.max,
                mid_batting_strike_rate: min_max_batting_strike_rate.mid_point,
                min_bowling_strike_rate: min_max_bowling_strike_rate.min,
                max_bowling_strike_rate: min_max_bowling_strike_rate.max,
                mid_bowling_strike_rate: min_max_bowling_strike_rate.mid_point,
                min_batting_avg: min_max_batting_average.min,
                max_batting_avg: min_max_batting_average.max,
                mid_batting_avg: min_max_batting_average.mid_point,
            });
        });
        this.state.min_max_sr_categories.map((category) => {
            categoryWisePlayersCount.push({
                category_name: category,
                players_count: this.state.playersData[category.category].length,
            });
            this.state.playersData[category.category].map((player) => {
                if (player.batting_strike_rate === 0 && player.bowling_strike_rate === 0) {
                    player.role = "Debutant";
                }
                else if (
                    player.batting_strike_rate > category.mid_batting_strike_rate &&
                    player.bowling_strike_rate > category.mid_bowling_strike_rate
                ) {
                    player.role = "Batsman";
                } else if (
                    player.batting_strike_rate < category.mid_batting_strike_rate &&
                    player.bowling_strike_rate < category.mid_bowling_strike_rate
                ) {
                    player.role = "Bowler";
                } else {
                    player.role = "All_Rounder";
                }
            });
            const t1 = [];
            t1.push(category.category, this.groupBy(this.state.playersData[category.category], "role"));
            groupByRoles.push(t1);
        });
        this.state.categories.map((category) => {
            var rank = 0;
            const roleWiseSort = this.groupBy(this.state.playersData[category], "role");
            roleWiseSort.Batsman === undefined
                ? roleWiseSort.Batsman
                : roleWiseSort.Batsman.sort(this.descendingSortByProperty("batting_strike_rate"));

            roleWiseSort.Batsman === undefined
                ? roleWiseSort.Batsman
                : roleWiseSort.Batsman.map((batsman) => {
                    batsman.rank = ++rank;
                });

            rank = 0;
            roleWiseSort.Bowler === undefined
                ? roleWiseSort.Bowler
                : roleWiseSort.Bowler.sort(this.ascendingSortByProperty("bowling_strike_rate"));

            roleWiseSort.Bowler === undefined
                ? roleWiseSort.Bowler
                : roleWiseSort.Bowler.map((bowler) => {
                    bowler.rank = ++rank;
                });

            rank = 0;
            roleWiseSort.All_Rounder === undefined
                ? roleWiseSort.All_Rounder
                : roleWiseSort.All_Rounder.sort(function (a, b) {
                    return a.batting_strike_rate > b.batting_strike_rate || a.bowling_strike_rate > b.bowling_strike_rate
                        ? 1
                        : a.batting_strike_rate < b.batting_strike_rate || a.bowling_strike_rate < b.bowling_strike_rate
                            ? -1
                            : 0;
                });
            roleWiseSort.All_Rounder === undefined
                ? roleWiseSort.All_Rounder
                : roleWiseSort.All_Rounder.map((allRounder) => {
                    allRounder.rank = ++rank;
                });
            RankWiseData.push(roleWiseSort);
            this.setState({
                rolewiseSortData: RankWiseData
            });
        })
    }

    calculate = async (value) => {
        await this.setState({
            selectedteamLength: value,
        });
        if (this.state.selectedteamLength > this.state.categorywiseTeamLength)
            var categoryTeam = this.state.selectedCategory;
        var teamLength = this.state.selectedteamLength;
        var categorywiseTeams = this.groupBy(this.state.teams, "category_name");
        var categoryLength = this.state.playersData[this.state.selectedCategory].length;
        if (parseInt(categoryLength) >= teamLength) {
            var totalTeam = Math.floor(categoryLength / teamLength);
            var bufferTeam = categoryLength % teamLength;
            if (categorywiseTeams[this.state.selectedCategory] !== undefined) {
                await this.setState({
                    totalTeams: totalTeam,
                    bufferPlayers: bufferTeam,
                    categorywiseTeamLength: categorywiseTeams[this.state.selectedCategory].length,
                })
            }
        } else {
            bufferPlayersList.push({ category_name: categoryTeam, players: this.state.playersData[categoryTeam] });
        }
    };

    calculateTeam = (categoryTeam, teamLen) => {
        var categoryLength = this.state.playersData[categoryTeam].length;
        var temptwo = [];
        if (parseInt(categoryLength) >= teamLen) {
            var totalTeam = Math.floor(categoryLength / teamLen);
            var bufferTeam = categoryLength % teamLen;
            var shufflePlayerID = this.shuffleID(totalTeam, categoryTeam, teamLen);
            var allTeamPlayerVV = this.teamAllocation(shufflePlayerID, categoryTeam, categoryLength, totalTeam, bufferTeam);
            allocatedTeamsWithCategories.push(allTeamPlayerVV);
            temptwo.push(allTeamPlayerVV);
        } else {
            bufferPlayersList.push({ category_name: categoryTeam, players: this.state.playersData[categoryTeam] });
        }
        return temptwo;
    };

    shuffleID = (totalTeam, categoryTeam, teamLen) => {
        var i,
            j,
            start = 0,
            end = totalTeam;
        var shufflePlayerID = [];
        totalTeam;
        for (i = 0; i < teamLen; i++) {
            var list = [];
            for (j = start; j < end; j++) {
                const li = {
                    id: this.state.playersData[categoryTeam][j].player_id,
                    player_full_name: this.state.playersData[categoryTeam][j].player_full_name,
                    age: this.state.playersData[categoryTeam][j].age,
                    birth_year: this.state.playersData[categoryTeam][j].birth_year,
                    mobile_no: this.state.playersData[categoryTeam][j].mobile_no,
                    batting_strike_rate: this.state.playersData[categoryTeam][j].batting_strike_rate,
                    bowling_strike_rate: this.state.playersData[categoryTeam][j].bowling_strike_rate,
                    role: this.state.playersData[categoryTeam][j].role,
                    players_photo: this.state.playersData[categoryTeam][j].player_photo,
                }
                list.push(li)
            }
            start = start + totalTeam;
            end = end + totalTeam;
            list.map((l) => {
                shufflePlayerID.push(l);
            });
        }
        return shufflePlayerID;
    };

    teamAllocation = (shufflePlayerID, categoryTeam, categoryLength, totalTeam, bufferTeam) => {
        var allTeamPlayer = [],
            allTeamPlayerVV = [],
            allTeamPlayerb = [],
            allTeamPlayerVVb = [];
        var bufferTemp = 0;
        for (var i = 0; i < totalTeam; i++) {
            var allTeamPlayer = [];
            for (var j = i; j < categoryLength - bufferTeam; j = j + totalTeam) {
                const pid = {
                    player_ID: shufflePlayerID[j].id,
                    player_full_name: shufflePlayerID[j].player_full_name,
                    age: shufflePlayerID[j].age,
                    birth_year: shufflePlayerID[j].birth_year,
                    mobile_no: shufflePlayerID[j].mobile_no,
                    batting_strike_rate: shufflePlayerID[j].batting_strike_rate,
                    bowling_strike_rate: shufflePlayerID[j].bowling_strike_rate,
                    role: shufflePlayerID[j].role,
                    photo: shufflePlayerID[j].players_photo,
                }
                allTeamPlayer.push(pid);
                bufferTemp = j;
            }
            const disn = {
                [categoryTeam]: allTeamPlayer,
            };
            allTeamPlayerVV.push(disn);
        }
        allTeamPlayer = [];
        for (var i = 0; i < bufferTeam; i++) {
            allTeamPlayerb.push(this.state.playersData[categoryTeam][bufferTemp + 1 + i].player_id);
        }
        const disnb = {
            [categoryTeam]: allTeamPlayerb,
        };
        allTeamPlayerVVb.push(disnb);
        return allTeamPlayerVV;
    };

    stepwiseteamform = async () => {
        var selectedcategoryId;
        var flag = -1;
        if (this.state.teamsData != null) {
            flag = 1;
        }
        var category = this.state.selectedCategory;
        for (var i = 0; i < this.state.teamsData.length; i++) {
            if (this.state.teamsData[i].category_name === category) {
                flag = 0;
                break;
            } else {
                flag = 1;
            }
        }

        if (flag == 1) {
            this.state.finalcategoryid.map((row) => {
                if (row.category_name === this.state.selectedCategory) {
                    selectedcategoryId = row.category_id;
                }
            })
            if (selectedcategoryId === undefined) {
                this.setState({
                    noTeamsAvailable:true
                })
                this.noTeamsAvailableNotification('error')
            } else {
                axios.post('http://localhost:4000/admin/teamFormation', {
                    team_length: this.state.selectedteamLength,
                    registered_players: this.state.selectedcategoryLength,
                    selected_category: this.state.selectedCategory,
                    buffer_player: this.state.bufferPlayers,
                    total_team: this.state.totalTeams,
                    category_id: selectedcategoryId,
                    already_created_teams: this.state.categorywiseTeamLength,
                }).then(() => {
                    this.getdataofTeams();
                    this.setState({
                        noTeamsAvailable:false,
                        setVisible: false,
                        selectedcategoryLength: '',
                        selectedteamLength: 'Select Team Length',
                        bufferPlayers: '',
                        totalTeams: '',
                        selectedCategory: 'Select Category',
                        categorywiseTeamLength: ''
                    })
                    this.onAddedNotification('success');
                });
            }
        }
        else if (flag == 0) {
            this.cannotAddDataNotification('error');
        }

    }

    onAddedNotification = (type) => {
        notification[type]({
            message: 'Team formation details added successfully.!!',
        });
    };

    onUpdateNotification = (type) => {
        notification[type]({
            message: 'Team formation details updated successfully.!!',
        });
    };

   noTeamsAvailableNotification = (type) => {
        notification[type]({
            message: 'Please create teams for selected category!!',
        });
    }


    cannotAddDataNotification = (type) => {
        notification[type]({
            message: 'You have already added details for choosen category !!',
        });
    }

    cannotProceedToAddTeamsNotificationPartOne = (type) => {
        notification[type]({
            message: 'Please select required fields and try again !!',
        });
    }

    cannotProceedToAddTeamsNotificationPartTwo = (type) => {
        notification[type]({
            message: 'Please create ' + (this.state.totalTeams - this.state.categorywiseTeamLength) + ' more teams or select another team size !!',
        });
    }
    
    cannotProceedToAddTeamsNotificationPartThree = (type) => {
        notification[type]({
            message: 'Please select another team size,current selection of size will form unbiased team formation !!',
        });
    }

    getTeams = () => {
        axios.get("http://localhost:4000/admin/teamfetch").then((res) => {
            this.setState({
                teams: res.data
            })
        })
    }

    doDestroy = (record) => {
        axios.post('http://localhost:4000/admin/teamdata/delete?category_name=' + record, {
            category_name: `${record}`
        }).then((response) => {
            this.getdataofTeams();
        });
    }

    onUpdate = () => {
        axios.post('http://localhost:4000/admin/update/teamdata', {
            team_length: this.state.selectedteamLength,
            registered_players: this.state.selectedcategoryLength,
            selected_category: this.state.selectedCategory,
            buffer_player: this.state.bufferPlayers,
            total_team: this.state.totalTeams,
            already_created_teams: this.state.categorywiseTeamLength
        }).then(() => {
            this.onUpdateNotification("success");
            this.setState({
                setVisible: false,
                selectedcategoryLength: '',
                bufferPlayers: '',
                totalTeams: '',
                selectedCategory: '',
                categorywiseTeamLength: ''
            })
            this.getdataofTeams();
        });
    }

    next = async () => {
        const current = this.state.current + 1;
        await this.setState({ current });
        if (this.state.current === 3) {
            this.handlercreate_teamD();
        }
    }

    prev = async() => {
        finalTeams = [];
        const current = this.state.current - 1;
        await this.setState({
            current,
            allTeamsWithPlayers:[]
         });
    }

    categoryLength = (value) => {
        this.setState({
            categoriesLength: this.state.playersData[value].length,
            selectedCategory: value,
            selectedcategoryLength: this.state.playersData[value].length
        })
    }

    handleUpdateDetails = async (record) => {
        await this.categoryLength(record.category_name)
        this.setState({
            setVisible: true,
            addOrUpdateDetails: false,
            selectedteamLength: record.team_length,
            bufferPlayers: record.total_buffer_players,
            totalTeams: record.total_teams_admin,
            selectedCategory: record.category_name,
            categorywiseTeamLength: record.already_created_teams
        })
    }

    handleAddDetails = () => {
        this.setState({
            setVisible: true,
            addOrUpdateDetails: true,
            selectedcategoryLength: '',
            selectedteamLength: 'Select Team Length',
            bufferPlayers: '',
            totalTeams: '',
            selectedCategory: 'Select Category',
            categorywiseTeamLength: ''
        })
    }

    handleSaveModal = async () => {
        if (this.state.addOrUpdateDetails) {
            if (this.state.selectedCategory == "Select Category" || this.state.selectedteamLength == "Select Team Length") {
                this.cannotProceedToAddTeamsNotificationPartOne('error');
            }
            else if (this.state.totalTeams > this.state.categorywiseTeamLength) {
                this.cannotProceedToAddTeamsNotificationPartTwo('error');
            }
            else if (this.state.totalTeams < this.state.categorywiseTeamLength) {
                this.cannotProceedToAddTeamsNotificationPartThree('error');
            } 
            else {
                this.stepwiseteamform();
            }
        } else {
            if (this.state.totalTeams > this.state.categorywiseTeamLength) {
                this.cannotProceedToAddTeamsNotificationPartTwo('error');
            }
            else if (this.state.totalTeams < this.state.categorywiseTeamLength) {
                this.cannotProceedToAddTeamsNotificationPartThree('error');
            } 
            else {
                this.onUpdate();
            }
        }
    };

    handleCancelModal = () => {
        this.setState({
            setVisible: false,
        });
    };

    renderStep2TableColumns = columns => {
        return columns.filter(
            column => column.key === "player_id" || column.key === "player_name" || column.key === "age" || column.key === "birth_year" || column.key === "mobile_no"
        );
    };

    renderStep3TableColumns = columns => {
        return columns.filter(
            column => column.key === "rank" || column.key === "player_id" || column.key === "year" || column.key === "player_name" || column.key === "age" ||
                column.key === "runs" || column.key === "overs" || column.key === "wickets" || column.key === "batting_strike_rate" || column.key === "bowling_strike_rate" ||
                column.key === "batting_Avg" || column.key === "role"
        );
    };

    render() {
        const { current } = this.state;
        var categorywisedata = [];
        var finalrolewise = [], finalroleData = [];
        var columns = [
            {
                title: "Rank",
                key: "rank",
                dataIndex: "rank",
                align: "center",
            },
            {
                title: "Player ID",
                key: "player_id",
                dataIndex: "player_id",
                align: "center",
            },
            {
                title: "Year",
                key: "year",
                dataIndex: "year",
                align: "center",
            },
            {
                title: "Player Name",
                key: "player_name",
                dataIndex: "player_full_name",
                align: "center",
                width: 150
            },
            {
                title: "Age",
                key: "age",
                dataIndex: "age",
                align: "center",
            },
            {
                title: "Birth Year",
                dataIndex: "birth_year",
                align: "center",
                key: "birth_year"
            },
            {
                title: "Mobile No",
                dataIndex: "mobile_no",
                align: "center",
                key: "mobile_no"
            },
            {
                title: "Runs",
                key: "runs",
                dataIndex: "runs",
                align: "center",
            },
            {
                title: "Overs",
                key: "overs",
                dataIndex: "overs",
                align: "center",
            },
            {
                title: "Wickets",
                key: "wickets",
                dataIndex: "wickets",
                align: "center",
            },
            {
                title: "Batting SR",
                key: "batting_strike_rate",
                dataIndex: "batting_strike_rate",
                align: "center",
                render: (text) => (Math.round(text * 100) / 100).toFixed(2),
            },
            {
                title: "Bowling SR",
                key: "bowling_strike_rate",
                dataIndex: "bowling_strike_rate",
                align: "center",
                render: (text) => (Math.round(text * 100) / 100).toFixed(2),
            },
            {
                title: "Batting Average",
                key: "batting_Avg",
                dataIndex: "batting_avg",
                align: "center",
                render: (text) => (Math.round(text * 100) / 100).toFixed(2),
            },
            {
                title: "Role",
                key: "role",
                dataIndex: "role",
                fixed: 'right',
                width: 110,
                align: "center",
                key: "role",
                render: (text, record) => {
                    return (
                        <>
                            {
                                this.state.current === 2 ?
                                    (record.role === "Batsman"
                                        ? <Tag color="processing" key={record.role}>{record.role}</Tag>
                                        : record.role === "Bowler" ?
                                            <Tag color="warning" key={record.role}>{record.role}</Tag>
                                            : record.role === "All_Rounder"
                                                ? <Tag color="error" key={record.role}>{record.role}</Tag>
                                                : <Tag color="green" key={record.role}>{record.role}</Tag>)
                                    : null
                            }
                        </>
                    )
                }
            },
        ];
        const step1Columns = [
            {
                title: "Category",
                dataIndex: "category_name",
                align: "center",
                key: "category_name"
            },
            {
                title: "Registered Players",
                dataIndex: "registered_players",
                align: "center",
                key: "registered_players"
            },
            {
                title: "Available Teams",
                dataIndex: "already_created_teams",
                align: "center",
                key: "already_created_teams"
            },
            {
                title: "Teams To Be Formed",
                dataIndex: "total_teams_admin",
                align: "center",
                key: "total_teams_admin",

            },
            {
                title: "Team Size",
                dataIndex: "team_length",
                align: "center",
                key: "team_length"
            },
            {
                title: "Extra Players Left",
                dataIndex: "total_buffer_players",
                align: "center",
                key: "total_buffer_players"
            },
            {
                title: "Action",
                key: 'action',
                fixed: 'right',
                width: 80,
                render: (_, record) => (
                    <div className="table-actions">
                        <Tooltip title="Update">
                            <EditTwoTone onClick={() => this.handleUpdateDetails(record)} />
                        </Tooltip>

                        <Divider type="vertical" />
                        <Popconfirm
                            title="Are you sure"
                            onConfirm={() => this.doDestroy(record.category_name)}
                            okText="Yes"
                            cancelText="NO"
                        >
                            <Tooltip title="Delete">
                                <DeleteTwoTone />
                            </Tooltip>
                        </Popconfirm>

                    </div>
                )
            }

        ]
        if (this.state.current === 1) {
            columns = this.renderStep2TableColumns(columns)
        } else if (this.state.current === 2) {
            columns = this.renderStep3TableColumns(columns)
        }
        return (
            <div className="scrollable-content">
                <Steps current={current} responsive>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} icon={item.icon} />
                    ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current > 0 && (
                        <Button
                            icon={<ArrowLeftOutlined />}
                            style={{ margin: '1.2em 0.2em 0.5em 0.2em' }}
                            onClick={() => this.prev()}
                        >
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            style={{ margin: '1.2em 0.2em 0.5em 0.2em', float: 'right' }}
                            onClick={() => this.next()}
                        >
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            style={{ margin: '1.2em 0.2em 0.5em 0.2em', float: 'right' }}
                            onClick={() => message.success('Team formation completed!')}
                        >
                            Done
                        </Button>
                    )}

                    {/* --------------------------1st STEP------------------------- */}
                    {
                        this.state.current == 0
                            ? <div>
                                <Button
                                    onClick={() => this.handleAddDetails()}
                                    type="primary"
                                    icon={<LeftOutlined />}
                                    style={{
                                        marginBottom: 15,
                                        marginLeft: 20,
                                        marginTop: 20
                                    }}
                                >
                                    {'Choose team size'}
                                </Button>
                                <Modal
                                    title={this.state.addOrUpdateDetails ? "Add team formation details:" : "Update team formation details:"}
                                    footer={null}
                                    visible={this.state.setVisible}
                                    onCancel={this.handleCancelModal}
                                >
                                    <>
                                        <Form
                                            {...formItemLayout}
                                            style={{ width: "100%" }}
                                            initialValues={{
                                                remember: true,
                                            }}
                                            onFinish={this.handleSaveModal}
                                            fields={[
                                                {
                                                    name: ["selectedCategory"],
                                                    value: this.state.selectedCategory
                                                },
                                                {
                                                    name: ["registerdPlayer"],
                                                    value: this.state.selectedcategoryLength
                                                },
                                                {
                                                    name: ["selectTeamLength"],
                                                    value: this.state.selectedteamLength
                                                },
                                                {
                                                    name: ["bufferPlayer"],
                                                    value: this.state.bufferPlayers
                                                },
                                                {
                                                    name: ["alreadyCreatedTeam"],
                                                    value: this.state.categorywiseTeamLength
                                                },
                                                {
                                                    name: ["TeamsToBeCreated"],
                                                    value: this.state.totalTeams
                                                }
                                            ]}
                                        >
                                            {this.state.addOrUpdateDetails ?
                                                <Form.Item
                                                    name="selectedCategory"
                                                    label="Select category: "
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please select category!',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Select category:"
                                                        onChange={(value) => {
                                                            this.categoryLength(value);
                                                            this.setState({
                                                                bufferPlayers: '',
                                                                categorywiseTeamLength: '',
                                                                selectedteamLength: 'Select Team Length',
                                                                totalTeams: '',
                                                            })
                                                        }}>
                                                        {
                                                            this.state.categories.map((category, i) => (
                                                                <>
                                                                    <Option key={i} value={category} >{category}</Option>
                                                                </>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                                :
                                                <Form.Item
                                                    name="selectedCategory"
                                                    label="Selected category: "
                                                >
                                                    <Input disabled={true} />
                                                </Form.Item>
                                            }
                                            <Form.Item
                                                name="registerdPlayer"
                                                label="Registered players: "
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>

                                            <Form.Item
                                                name="selectTeamLength"
                                                label="Select team size: "
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please select team size!',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Select team size:"
                                                    onChange={(value) => {
                                                        this.calculate(value);
                                                    }}
                                                >
                                                    <>
                                                        <Option value="5" >5</Option>
                                                        <Option value="6" >6</Option>
                                                        <Option value="7" >7</Option>
                                                        <Option value="8" >8</Option>
                                                        <Option value="9" >9</Option>
                                                        <Option value="10">10</Option>
                                                        <Option value="11">11</Option>
                                                    </>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                name="alreadyCreatedTeam"
                                                label="Available teams: "
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>

                                            <Form.Item
                                                name="TeamsToBeCreated"
                                                label="Teams to be formed: "
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>

                                            <Form.Item
                                                name="bufferPlayer"
                                                label="Extra players left: "
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>

                                            <Form.Item
                                                wrapperCol={{
                                                    xs: {
                                                        span: 22,
                                                        offset: 0,
                                                    },
                                                    sm: {
                                                        span: 14,
                                                        offset: 8,
                                                    },
                                                }}
                                            >
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </Form.Item>
                                            {(this.state.totalTeams > this.state.categorywiseTeamLength ||
                                                this.state.noTeamsAvailable)
                                            &&
                                                <Form.Item
                                                    wrapperCol={{
                                                        xs: {
                                                            span: 22,
                                                            offset: 0,
                                                        },
                                                        sm: {
                                                            span: 14,
                                                            offset: 8,
                                                        },
                                                    }}
                                                >
                                                    <Link to={`/admin/team`}>
                                                        <Button
                                                            icon={<LeftOutlined />}
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                        >
                                                            {'Create Teams'}
                                                        </Button>
                                                    </Link>
                                                </Form.Item>
                                            }
                                        </Form>
                                    </>
                                </Modal>
                                <Table key='Team_details'
                                    columns={step1Columns}
                                    dataSource={this.state.teamsData}
                                    scroll={{ x: 700 }}
                                    rowKey={"category_name"}
                                ></Table>
                            </div>
                            : null
                    }

                    {/* --------------------------2nd STEP------------------------- */}
                    <Tabs defaultActiveKey="1"  >
                        {this.state.current == 1 &&
                            this.state.categories.map((category, catt) => (
                                <TabPane tab={`${category}`} key={category} >
                                    <Table key={catt}
                                        columns={columns}
                                        dataSource={this.state.playersData[category]}
                                        scroll={{ x: 500 }}
                                        rowKey={"player_id"}
                                    />
                                </TabPane>
                            ))}
                    </Tabs>

                    {/* --------------------------3rd STEP------------------------- */}
                    <div>
                        <Tabs defaultActiveKey="1"  >
                            {this.state.current == 2 &&
                                this.state.categories.map((category, i) => {
                                    var rank = 0;
                                    const roleWiseSort = this.groupBy(this.state.playersData[category], "role");
                                    roleWiseSort.Batsman === undefined
                                        ? roleWiseSort.Batsman
                                        : roleWiseSort.Batsman.sort(this.descendingSortByProperty("batting_strike_rate"));

                                    roleWiseSort.Batsman === undefined
                                        ? roleWiseSort.Batsman
                                        : roleWiseSort.Batsman.map((batsman) => {
                                            batsman.rank = ++rank;
                                        });

                                    rank = 0;
                                    roleWiseSort.Bowler === undefined
                                        ? roleWiseSort.Bowler
                                        : roleWiseSort.Bowler.sort(this.ascendingSortByProperty("bowling_strike_rate"));

                                    roleWiseSort.Bowler === undefined
                                        ? roleWiseSort.Bowler
                                        : roleWiseSort.Bowler.map((bowler) => {
                                            bowler.rank = ++rank;
                                        });

                                    rank = 0;
                                    roleWiseSort.All_Rounder === undefined
                                        ? roleWiseSort.All_Rounder
                                        : roleWiseSort.All_Rounder.sort(function (a, b) {
                                            return a.batting_strike_rate > b.batting_strike_rate || a.bowling_strike_rate > b.bowling_strike_rate
                                                ? 1
                                                : a.batting_strike_rate < b.batting_strike_rate || a.bowling_strike_rate < b.bowling_strike_rate
                                                    ? -1
                                                    : 0;
                                        });

                                    roleWiseSort.All_Rounder === undefined
                                        ? roleWiseSort.All_Rounder
                                        : roleWiseSort.All_Rounder.map((allRounder) => {
                                            allRounder.rank = ++rank;
                                        });

                                    return (
                                        <TabPane tab={category} key={i} >

                                            { roleWiseSort.Debutant === undefined ? null :
                                                <>
                                                    <h4 id="role_thirdstep">Debutant</h4>
                                                    <Table key={i}
                                                        columns={columns}
                                                        dataSource={roleWiseSort.Debutant}
                                                        className="player-rank-table"
                                                        rowKey={"player_id"}
                                                        scroll={{ x: 1100 }}
                                                    />
                                                </>
                                            }

                                            { roleWiseSort.Batsman === undefined ? null :
                                                <>
                                                    <h4 id="role_thirdstep">Batsman</h4>
                                                    <Table key={i}
                                                        columns={columns}
                                                        dataSource={roleWiseSort.Batsman}
                                                        className="player-rank-table"
                                                        rowKey={"player_id"}
                                                        scroll={{ x: 1100 }}
                                                    />
                                                </>
                                            }

                                            { roleWiseSort.Bowler === undefined ? null :
                                                <>
                                                    <h4 id="role_thirdstep">Bowler</h4>
                                                    <Table key={i}
                                                        columns={columns}
                                                        dataSource={roleWiseSort.Bowler}
                                                        className="player-rank-table"
                                                        rowKey={"player_id"}
                                                        scroll={{ x: 1100 }}
                                                    />
                                                </>
                                            }

                                            { roleWiseSort.All_Rounder === undefined ? null :
                                                <>
                                                    <h4 id="role_thirdstep">All Rounder</h4>
                                                    <Table key={i}
                                                        columns={columns}
                                                        dataSource={roleWiseSort.All_Rounder}
                                                        className="player-rank-table"
                                                        rowKey={"player_id"}
                                                        scroll={{ x: 1100 }}
                                                    />
                                                </>
                                            }
                                        </TabPane>
                                    );
                                })}
                        </Tabs>
                    </div>
                    <div>
                        {/* --------------------------4th STEP------------------------- */}
                        <Tabs defaultActiveKey="1" >
                            {this.state.current == 3 &&
                                this.state.categories.map((category, m) => {
                                    categorywisedata = this.groupBy(this.state.allTeamsWithPlayers, "category");
                                    if (categorywisedata[category] === undefined) { }
                                    else {
                                        return (
                                            <TabPane tab={category} key={m} >
                                                <Tabs defaultActiveKey="1">
                                                    {categorywisedata[category].map((row, r) => {
                                                        finalrolewise = this.groupBy(row.players, "role");
                                                        return (
                                                            <TabPane tab={row.team_name} key={r}>
                                                                <Card id="teamname" bordered={false} style={{ width: "100%" }}>
                                                                    {
                                                                        this.state.roles.map((role) => {
                                                                            return (
                                                                                <>
                                                                                    {
                                                                                        finalrolewise[role] != undefined &&
                                                                                        <Card id="role" title={<h4>{role}</h4>} bordered={false} style={{ padding: 0 }}>
                                                                                            <div >
                                                                                                <div className="row">
                                                                                                    {
                                                                                                        finalrolewise[role].map((players_data) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <div className="col-sm-4 col-md-4 col-lg-4" >
                                                                                                                        <Card bordered={false} style={{ marginBottom: 0 }}>
                                                                                                                            <div className="row" >
                                                                                                                                <div className="col-sm col-md">
                                                                                                                                    {((Buffer.from(players_data.photo, "utf8").length) <= 15) ? <img src={playerAvatar} width="60" height="60" alt="No image" /> : <img src={Buffer.from(players_data.photo, "utf8")} width="60" height="60" alt="No image" />}
                                                                                                                                </div>
                                                                                                                                <div className="col-sm col-md">
                                                                                                                                    <strong>{players_data.player_full_name}</strong><br />
                                                                                                                                    {
                                                                                                                                        players_data.bowling_strike_rate !== null && players_data.batting_strike_rate !== null ?
                                                                                                                                            players_data.role === "Bowler" ? <Tag color="warning" >Bowling SR: {players_data.bowling_strike_rate.toFixed(2)}</Tag>
                                                                                                                                                : (players_data.role === "Batsman" ? <Tag color="green" >Batting SR: {players_data.batting_strike_rate.toFixed(2)}</Tag> :
                                                                                                                                                    <div><Tag color="green" >Batting SR: {players_data.batting_strike_rate.toFixed(2)}</Tag> <br />
                                                                                                                                                        <Tag color="warning" >Bowling SR: {players_data.bowling_strike_rate.toFixed(2)}</Tag></div>)
                                                                                                                                            : <Tag color="error">No SR available</Tag>
                                                                                                                                    }
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </Card>
                                                                                                                        <hr></hr>
                                                                                                                    </div>
                                                                                                                </>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </Card>
                                                                                    }
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </Card>
                                                            </TabPane>
                                                        )
                                                    })}
                                                </Tabs>
                                                <hr></hr>
                                            </TabPane>
                                        )
                                    }
                                })}
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default Stepwiseteam
