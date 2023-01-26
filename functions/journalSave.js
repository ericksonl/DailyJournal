async function journalSchema(user, inArray) {
    //first see if there already exists a database for UserID
    setupSchema.findOne({ UserID: user }, async (err, data) => {
      //if no data, create an object for the user
      if (!data) {
        //Get user to create a key
  
        //if not, create a new one
        await setupSchema.create({
          UserID: user,
          Key: key,
          DailyJournal: inArray
        })
      } else {
  
        //add contents of outArr to 
  
        let result = await setupSchema.updateOne(
          { UserID: user },
          {
            $set: { DailyJournal: update }
          })
        console.log(result)
  
        //let user know everything has been saved, and ask them to close the dm
  
      }
    })
  }