//Database Connection
const { resolve } = require("promise");
const pool = require("../config/pool");
const async = require('async');

const getSegmentationCourseMenu = async (req, res) => {

    if (req.body.user_id) {
        //Total Course Progress
        var totalCourseDuration = 0;
        var totalCourseProgress = 0;

        const segmentation_course_menu = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM segmentation_course_menu`;

            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (result && result.length > 0) {
                    //Checking If User is Already Inrolled
                    const check_user_data_sql = `Select * FROM segmentation_course_menu_detail 
                                            WHERE
                                            webapp_user_id=${req.body.user_id}                                            
                                            `;
                    pool.query(check_user_data_sql, async (check_user_err, check_user_result) => {
                        if (check_user_err) {
                            res.status(400).send(check_user_err);
                        }

                        if (check_user_result && !check_user_result.length > 0) {
                            //Insert If User Has No data in Database
                            await insertIntoSegmentationCourse(req.body.user_id, "menu", 1);
                            await insertIntoSegmentationCourse(req.body.user_id, "sub_menu", 1, 1);
                            return resolve(result);
                        } else {
                            return resolve(result);
                        }

                    })

                } else {
                    return resolve();
                }
            })
        });

        const segmentation_course_sub_menu = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM segmentation_course_sub_menu`;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (result && result.length > 0) {
                    return resolve(result);
                } else {
                    return resolve();
                }
            });

        })

        const segmentation_course_sub_sub_menu = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM segmentation_course_sub_sub_menu`;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (result && result.length > 0) {
                    return resolve(result);
                } else {
                    return resolve();
                }
            });
        })

        const segmentation_course_videos = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM segmentation_course_videos`;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (result && result.length > 0) {
                    return resolve(result);
                } else {
                    return resolve();
                }
            });
        })

        const segmentation_course_menu_user_details = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM segmentation_course_menu_detail 
                        WHERE
                        webapp_user_id=${req.body.user_id}
                        `;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (result && result.length > 0) {
                    return resolve(result);
                } else {
                    return resolve();
                }
            })
        })

        const segmentation_course_sub_menu_user_details = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM segmentation_course_sub_menu_detail 
                        WHERE
                        webapp_user_id=${req.body.user_id}
                        `;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (result && result.length > 0) {
                    return resolve(result);
                } else {
                    return resolve();
                }
            })
        })


        const segmentation_course_sub_sub_menu_user_details = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM segmentation_course_sub_sub_menu_detail 
                        WHERE
                        webapp_user_id=${req.body.user_id}
                        `;
            pool.query(sql, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (result && result.length > 0) {
                    return resolve(result);
                } else {
                    return resolve();
                }
            })
        });

        //Get LT Details
        const get_Segmentation_course_LT_details = await new Promise((resolve, reject) => {
            if (req.body.language_id) {
                const sql = `SELECT a.Language_id,a.audio_id,a.is_guided,a.segmentation_course_type,ua.users_audio_id,ua.status,ua.is_submitted FROM audio a
                JOIN users_audio ua ON
                ua.audio_id=a.audio_id
                WHERE
                ua.user_id IN (SELECT users.user_id FROM users WHERE
                                users.web_app_id=${req.body.user_id}
                )
                AND (a.Language_id=${req.body.language_id} 
                OR a.Language_id=83)
                AND a.segmentation_course_type IS NOT NULL
    `
    //In the above query check for user select language or english language_id 
                pool.query(sql, (err, result) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    if (result && result.length > 0) {
                        return resolve(result);
                    } else {
                        return resolve("LT Audio not available.");
                    }
                })
            } else {
                return resolve("Language Id Not Found.")
            }

        });

        //New Object For Menus
        let segmentation_course_menu_details = {};
        segmentation_course_menu_details["user_id"] = req.body.user_id;
        segmentation_course_menu_details["menu"] = [];
        segmentation_course_menu_details["user_menu_progress"] = 0;
        segmentation_course_menu_details["guided_videos"] = segmentation_course_videos;
        segmentation_course_menu_details["LT_audio_details"] = get_Segmentation_course_LT_details;

        if (segmentation_course_menu && segmentation_course_menu.length > 0) {
            for (var i = 0; i < segmentation_course_menu.length; i++) {
                var newObject = {
                    menu_id: segmentation_course_menu[i]["menu_id"],
                    menu_title: segmentation_course_menu[i]["menu_title"],
                    total_duration: segmentation_course_menu[i]["totalDuration"],
                    sub_menu: []
                }
                if (segmentation_course_menu[i]["totalDuration"]) {
                    totalCourseDuration += timeToSecs(segmentation_course_menu[i]["totalDuration"]);
                }

                segmentation_course_menu_details["menu"].push(newObject);
            }
        }

        //New Object For Sub Menu
        if (segmentation_course_sub_menu && segmentation_course_sub_menu.length > 0) {
            for (var i = 0; i < segmentation_course_sub_menu.length; i++) {
                var newSubObject = {
                    sub_menu_id: segmentation_course_sub_menu[i]["sub_menu_id"],
                    sub_menu_title: segmentation_course_sub_menu[i]["sub_menu_title"],
                    total_duration: segmentation_course_sub_menu[i]["totalDuration"],
                    sub_sub_menu: []
                }
                if (segmentation_course_sub_menu[i]["totalDuration"]) {
                    totalCourseDuration += timeToSecs(segmentation_course_sub_menu[i]["totalDuration"])
                }
                segmentation_course_menu_details["menu"].filter((menu, index) => {
                    if (menu.menu_id === segmentation_course_sub_menu[i]["menu_id"]) {
                        segmentation_course_menu_details["menu"][index]["sub_menu"].push(newSubObject);
                    }
                }
                );
            }
        }

        //New Object For Sub-Sub Menu
        if (segmentation_course_sub_sub_menu && segmentation_course_sub_sub_menu.length > 0) {
            for (var i = 0; i < segmentation_course_sub_sub_menu.length; i++) {
                var newSubSubObject = {
                    sub_sub_menu_id: segmentation_course_sub_sub_menu[i]["sub_sub_menu_id"],
                    sub_sub_menu_title: segmentation_course_sub_sub_menu[i]["sub_sub_menu_title"],
                    total_duration: segmentation_course_sub_sub_menu[i]["totalDuration"]
                }
                if (segmentation_course_sub_sub_menu[i]["totalDuration"]) {
                    totalCourseDuration += timeToSecs(segmentation_course_sub_sub_menu[i]["totalDuration"]);
                }
                segmentation_course_menu_details["menu"].filter((menu, menuindex) => {
                    menu["sub_menu"].filter((submenu, submenuindex) => {

                        if (submenu.sub_menu_id === segmentation_course_sub_sub_menu[i]["sub_menu_id"]) {
                            segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["sub_sub_menu"].push(newSubSubObject);
                        }
                    })
                }
                );

            }
        }

        //Adding User Details to Course Menu        
        if (segmentation_course_menu_user_details && segmentation_course_menu_user_details.length > 0) {
            for (var i = 0; i < segmentation_course_menu_user_details.length; i++) {
                segmentation_course_menu_details["menu"].filter((menu, index) => {

                    if (menu.menu_id === segmentation_course_menu_user_details[i]["menu_id"]) {
                        if (segmentation_course_menu_details["menu"][index]["total_duration"]) {
                            if (segmentation_course_menu_user_details[i]["status"] && segmentation_course_menu_user_details[i]["status"] != "in progress") {
                                totalCourseProgress += timeToSecs(segmentation_course_menu_details["menu"][index]["total_duration"]);
                            }
                        }
                        segmentation_course_menu_details["menu"][index]["is_active"] = segmentation_course_menu_user_details[i]["is_active"];
                        segmentation_course_menu_details["menu"][index]["status"] = segmentation_course_menu_user_details[i]["status"];
                    } else {
                        segmentation_course_menu_details["menu"][index]["is_active"] = 0;
                    }
                })
            }
        }

        if (segmentation_course_sub_menu_user_details && segmentation_course_sub_menu_user_details.length > 0) {
            for (var i = 0; i < segmentation_course_sub_menu_user_details.length; i++) {
                segmentation_course_menu_details["menu"].filter((menu, menuindex) => {
                    menu["sub_menu"].filter((submenu, submenuindex) => {
                        if (submenu.sub_menu_id === segmentation_course_sub_menu_user_details[i]["sub_menu_id"]) {
                            if (segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["total_duration"]) {
                                if (segmentation_course_sub_menu_user_details[i]["status"] && segmentation_course_sub_menu_user_details[i]["status"] != "in progress") {
                                    totalCourseProgress += timeToSecs(segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["total_duration"]);
                                }
                            }
                            segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["is_active"] = segmentation_course_sub_menu_user_details[i]["is_active"];
                            segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["status"] = segmentation_course_sub_menu_user_details[i]["status"];

                            //Uncommenting this will set is_active and status empty for all other menus
                        } else {
                            segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["is_active"] = 0;
                            // segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["status"] = "";
                        }
                    })
                })
            }
        }

        if (segmentation_course_sub_sub_menu_user_details && segmentation_course_sub_sub_menu_user_details.length > 0) {
            for (var i = 0; i < segmentation_course_sub_sub_menu_user_details.length; i++) {
                segmentation_course_menu_details["menu"].filter((menu, menuindex) => {
                    menu["sub_menu"].filter((submenu, submenuindex) => {
                        if (submenu["sub_sub_menu"] && submenu["sub_sub_menu"].length > 0) {
                            submenu["sub_sub_menu"].filter((subsubmenu, subsubmenuindex) => {
                                if (subsubmenu.sub_sub_menu_id === segmentation_course_sub_sub_menu_user_details[i]["sub_sub_menu_id"]) {
                                    if (segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["sub_sub_menu"][subsubmenuindex]["total_duration"]) {
                                        if (segmentation_course_sub_sub_menu_user_details[i]["status"] && segmentation_course_sub_sub_menu_user_details[i]["status"] != "in progress") {
                                            totalCourseProgress += timeToSecs(segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["sub_sub_menu"][subsubmenuindex]["total_duration"]);
                                        }
                                    }
                                    segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["sub_sub_menu"][subsubmenuindex]["is_active"] = segmentation_course_sub_sub_menu_user_details[i]["is_active"];
                                    segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["sub_sub_menu"][subsubmenuindex]["status"] = segmentation_course_sub_sub_menu_user_details[i]["status"];

                                    //Uncommenting this will set is_active and status empty for all other menus
                                } else {
                                    segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["sub_sub_menu"][subsubmenuindex]["is_active"] = 0;
                                    // segmentation_course_menu_details["menu"][menuindex]["sub_menu"][submenuindex]["sub_sub_menu"][subsubmenuindex]["status"] = "";
                                }
                            })
                        }
                    })
                })
            }
        }

        //Total Course Complete Percentage
        segmentation_course_menu_details["user_menu_progress"] = (totalCourseProgress / totalCourseDuration) * 100;
        //Send Response 
        res.status(200).send(segmentation_course_menu_details);
    } else {
        res.status(400).send("User Id Not Found");
    }
}

//Update Course Details
const updateSegmentationCourseUserDetail = async (req, res) => {
    if (req.body.user_id && req.body.menu_id) {
        const value = await updateSegmentationCourseUserFunction(req.body.user_id, req.body.menu_id, req.body.sub_menu_id, req.body.sub_sub_menu_id, req.body.duration);

        if (value == "OK") {
            getSegmentationCourseMenu(req, res);
            //res.status(200).send("Updated");
        } else {
            res.status(400).send("Error");
        }
    } else {
        res.status(400).send("User Id/Menu Id not found");
    }

}

//Must send Menu Ids of the next menu
const updateSegmentationCourseUserFunction = async (user_id, menu_id, sub_menu_id = null, sub_sub_menu_id = null, duration = 0) => {//User ID, Menu Type, Menu_Type Primary Key,Duration For menu
    let menuPromise, subMenuPromise, subSubMenuPromise
    if (menu_id) {
        menuPromise = await new Promise((resolve, reject) => {
            let check_user_data_sql = `SELECT * FROM segmentation_course_menu_detail 
                            WHERE webapp_user_id=${user_id} AND menu_id=${menu_id}                    
        `;
            pool.query(check_user_data_sql, async (err, result) => {
                if (err) {
                    console.log(err)
                }
                let sql;
                if (result && result.length > 0) {
                    //Update Previous Menu 
                    sql = `UPDATE segmentation_course_menu_detail 
                        set is_active=0,
                        status="completed"
                        WHERE 
                        webapp_user_id=${user_id} AND NOT menu_id=${menu_id}
                    `

                    resolve(sql);
                } else if (result && !result.length > 0) {
                    //Insert New Menu
                    sql = `INSERT INTO segmentation_course_menu_detail
                        (webapp_user_id,menu_id,is_active,status) 
                        VALUES (${user_id},${menu_id},1,"in progress");
                    `;
                    await new Promise((resolve1, reject1) => {
                        pool.query(sql, (err1, result) => {
                            if (err1) {
                                console.log(err1);
                            }
                            //Update Previous After Inserting New
                            let updateSql = `UPDATE segmentation_course_menu_detail 
                            set is_active=0,
                            status="completed"
                            WHERE 
                            webapp_user_id=${user_id} AND NOT menu_id=${menu_id}
                            `

                            resolve(updateSql);
                        })
                    })
                }
            })
        }).then(async (value) => {

            return await new Promise((resolve1, reject) => {
                pool.query(value, (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve1("Error");
                    }

                    resolve1("OK");
                })
            })
        });

    }
    if (sub_menu_id) {
        subMenuPromise = await new Promise((resolve, reject) => {
            let check_user_data_sql = `SELECT * FROM segmentation_course_sub_menu_detail 
                            WHERE webapp_user_id=${user_id} AND sub_menu_id=${sub_menu_id}                    
        `;
            pool.query(check_user_data_sql, async (err, result) => {
                if (err) {
                    console.log(err)
                }
                let sql;
                if (result && result.length > 0) {
                    //Update Previous Menu
                    sql = `UPDATE segmentation_course_sub_menu_detail 
                        set is_active=0
                        ,status="completed"
                        WHERE 
                        webapp_user_id=${user_id} AND NOT sub_menu_id=${sub_menu_id}
                    `
                    resolve(sql);
                } else if (result && !result.length > 0) {
                    //Insert New And Update Previous
                    sql = `INSERT INTO segmentation_course_sub_menu_detail
                        (webapp_user_id,sub_menu_id,is_active,duration,status) 
                        VALUES (${user_id},${sub_menu_id},1,${duration},"in progress");
                    `;

                    await new Promise((resolve1, reject) => {
                        pool.query(sql, (err1, result) => {
                            if (err1) {
                                console.log(err1);
                            }
                            let updateSql = `UPDATE segmentation_course_sub_menu_detail 
                            set is_active=0
                            ,status="completed"
                            WHERE 
                            webapp_user_id=${user_id} AND NOT sub_menu_id=${sub_menu_id}
                        `;
                            resolve(updateSql);
                        })
                    })

                }
            })
        }).then(async (value) => {

            return await new Promise((resolve1, reject) => {
                pool.query(value, (err, result) => {

                    if (err) {
                        console.log(err);
                        resolve1("Error");
                    }
                    resolve1("OK");
                })
            })
        });
    }
    if (sub_sub_menu_id) {
        subSubMenuPromise = await new Promise((resolve, reject) => {
            let check_user_data_sql = `SELECT * FROM segmentation_course_sub_sub_menu_detail 
                            WHERE webapp_user_id=${user_id} AND sub_sub_menu_id=${sub_sub_menu_id}                    
        `;
            pool.query(check_user_data_sql, async (err, result) => {
                if (err) {
                    console.log(err)
                }
                let sql;
                if (result && result.length > 0) {
                    //Update Previous Menu
                    sql = `UPDATE segmentation_course_sub_sub_menu_detail 
                        set is_active=0
                        ,status="completed"
                        WHERE 
                        webapp_user_id=${user_id} AND NOT sub_sub_menu_id=${sub_sub_menu_id}
                    `
                    resolve(sql);
                } else if (result && !result.length > 0) {
                    //Insert New and Update Previous
                    sql = `INSERT INTO segmentation_course_sub_sub_menu_detail
                        (webapp_user_id,sub_sub_menu_id,is_active,duration,status) 
                        VALUES (${user_id},${sub_sub_menu_id},1,${duration},"in progress");
                    `;
                    await new Promise((resolve1, reject) => {
                        pool.query(sql, (err1, result) => {
                            if (err1) {
                                console.log(err1);
                            }
                            let updateSql = `UPDATE segmentation_course_sub_sub_menu_detail 
                            set is_active=0
                            ,status="completed"
                            WHERE 
                            webapp_user_id=${user_id} AND NOT sub_sub_menu_id=${sub_sub_menu_id}
                        `;
                            resolve(updateSql);
                        })
                    })
                }
            })
        }).then(async (value) => {

            return await new Promise((resolve1, reject) => {
                pool.query(value, (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve1("Error");
                    }
                    resolve1("OK");
                })
            })
        });
    }

    if (menuPromise && menuPromise.length > 0) {
        return ("OK");
    } else {
        return ("Error");
    }

}


//Finish Segmentation Course Function
//Set User Courses to Complement and active status to false
//Only Call At the end of Course 
const finishSegmentationCourse = (req, res) => {
    if (req.body.user_id) {
        async.parallel({
            menu: function (callback) {
                let sql = `UPDATE segmentation_course_menu_detail 
                    SET is_active=0,
                    status="completed"
                    WHERE webapp_user_id=${req.body.user_id}
            `
                pool.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result) {
                        callback(null, "Success");
                    }

                })
            },
            sub_menu: function (callback) {
                let sql = `UPDATE segmentation_course_sub_menu_detail 
                    SET is_active=0,
                    status="completed"
                    WHERE webapp_user_id=${req.body.user_id}
            `
                pool.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);

                    }
                    if (result) {
                        callback(null, "Success");
                    }
                })
            },
            sub_sub_menu: function (callback) {
                let sql = `UPDATE segmentation_course_sub_sub_menu_detail
                    SET is_active=0,
                    status="completed"
                    WHERE webapp_user_id=${req.body.user_id}
            `
                pool.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result) {
                        callback(null, "Success");
                    }
                })
            }
        }, async function (err, results) {
            if (results) {
                if (results.menu === "Success" && results.sub_menu === "Success" && results.sub_sub_menu === "Success") {
                    await getSegmentationCourseMenu(req, res);
                } else {
                    res.status(400).send("Error");
                }
            } else {
                res.status(400).send("Error");
            }
        });
    } else {
        res.status(400).send("User Id Not Found");
    }
}
//Insert Into Segmentation Course Tables 
const insertIntoSegmentationCourse = (user_id, type, menu_type_id, duration = 0) => {//User ID, Menu Type, Menu_Type Primary Key,Duration For menu
    let sql;
    if (type == "menu") {
        sql = `INSERT INTO segmentation_course_menu_detail
            (webapp_user_id,menu_id,is_active,status) 
            VALUES (${user_id},${menu_type_id},1,"in progress")`;
    } else if (type == "sub_menu") {
        sql = `INSERT INTO segmentation_course_sub_menu_detail
            (webapp_user_id,sub_menu_id,status,is_active,duration) 
            VALUES (${user_id},${menu_type_id},"in progress",1,${duration})`;
    } else if (type == "sub_sub_menu") {
        sql = `INSERT INTO segmentation_course_sub_sub_menu_detail
            (webapp_user_id,sub_sub_menu_id,status,is_active,duration) 
            VALUES (${user_id},${menu_type_id},"in progress",1,${duration})`;
    }
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);

            }
            if (result && result.length > 0) {
                return resolve(result);
            } else {
                return resolve();
            }
        });
    });


}

// Convert time in H[:mm[:ss]] format to seconds
function timeToSecs(time) {
    let [h, m, s] = time.split(':');
    return h * 3600 + (m | 0) * 60 + (s | 0) * 1;
}

module.exports = {
    getSegmentationCourseMenu,
    updateSegmentationCourseUserDetail,
    finishSegmentationCourse
}