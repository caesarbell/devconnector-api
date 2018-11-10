const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const passport = require('passport'); 


/**
 * Load validation
 */

const validateProfileInput = require('../../jobs/validation/profile'); 
const validateExperienceInput = require('../../jobs/validation/experience');
const validateEducationInput = require('../../jobs/validation/education'); 


/**
 * Load Profile Model
 */

 const Profile = require('../../models/Profile'); 

 /**
  * Load User 
  */

  const User = require('../../models/User'); 

/**
 * @route GET api/profile
 * @desc Get current users profile 
 * @access Private 
 */

router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    const errors = {}; 

    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'; 
                return res.status(404).json(errors); 
            }

            res.json(profile)
        })
        .catch(err => rs.status(404).json(err)); 
});

/**
 * @route GET api/profile/all
 * @desc Get all profiles 
 * @access Public  
 */

 router.get('/all', (req, res) => {
     const errors = {}; 

     Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noprofile = 'There ar eno profiles';
                return res.status(404).json(errors);
            }

            res.json(profiles);
        })
         .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
 })


/**
 * @route GET api/profile/handle/:handle
 * @desc Get profile by handle 
 * @access Public  
 */

 router.get('/handle/:handle', (req, res) => {
     const errors = {};

    Profile.findOne({ handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no Profile';
                res.status(404).json(errors); 
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
 })


/**
 * @route GET api/profile/user/user_id
 * @desc Get profile by User ID  
 * @access Public  
 */

router.get('/user/:user_id', (req, res) => {
    const errors = {};

    /**
     * Don't use user.id because that will give us the logged in user
     * we want the user passed in from the url 
     */
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no Profile';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json({ profile: 'There is no profile for this user'}));
})

/**
 * @route POST api/profile
 * @desc Create or update user profile 
 * @access Private 
 */

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateProfileInput(req.body); 

    /**
     * Check Validation
     */

     if(!isValid) {
         /**
          * Return any erros with 400 status
          */

          return res.status(400).json(errors); 
     }

    /**
     * Get Fields
     */

     const profileFields = {}; 
     profileFields.user = req.user.id; 

    /**
     * Checking if fields are available 
     */
    const fieldTypes = ['handle', 'company', 'status', 'website', 'location', 'githubusername', 'bio']; 
     fieldTypes.forEach(field_type => {
         if(req.body[field_type]) profileFields[field_type] = req.body[field_type]; 
     }); 

     /**
      * Skills - Split into array
      */

      if(typeof req.body.skills !== 'undefined') {
          profileFields.skills = req.body.skills.split(','); // checks for comma separated values and puts them into an array
      }; 

      /**
       * Social, create an empty object first to avoid errors of social being undefined
       */

       profileFields.social = {};
       const soicalPlatforms = ['youtube', 'facebook', 'instagram', 'linkedin', 'twitter']; 

       soicalPlatforms.forEach(platform => {
           if(req.body[platform]) profileFields.social[platform] = req.body[platform]; 
       }); 

       Profile.findOne({ user: req.user.id }).then(profile => {
           if(profile) {
               /**
                * Update profile
                */

                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                .then(profile => res.json(profile)); 

           } else {
               /**
                * Create profile
                */

                /**
                 * Check if handle exists
                 */

                 Profile.findOne({ handle: profileFields.handle }).then(profile => {
                     if(profile) {
                         errors.handle = 'That handle already exists'; 
                         res.status(400).json(errors); 
                     }
                 }); 

                 /**
                  * Save Profile 
                  */

                  new Profile(profileFields).save().then(profile => res.json(profile)).catch(err => console.error(err)); 
           }
       })

   
});


/**
 * @route POST api/profile/experience
 * @desc Add experience to profile
 * @access Private 
 */

router.post('/experience', passport.authenticate('jwt', { session: false}), (req, res) => {

    const { errors, isValid } = validateExperienceInput(req.body);

    /**
     * Check Validation
     */

    if (!isValid) {
        /**
         * Return any erros with 400 status
         */

        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }; 

            /**
             * Add to experience array
             */

            profile.experience.unshift(newExp); 

             profile.save().then(profile => res.json(profile));
        });
});


/**
 * @route POST api/profile/education
 * @desc Add education to profile
 * @access Private 
 */

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateEducationInput(req.body);

    /**
     * Check Validation
     */

    if (!isValid) {
        /**
         * Return any erros with 400 status
         */

        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            /**
             * Add to education array
             */

            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        })
});


/**
 * @route DELETE api/profile/experience/:exp_id
 * @desc Delete experience from profile
 * @access Private 
 */

router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(profile => {

            /**
             * Get remove index
             */

             const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);


            /**
             * Splice out of array
             */

             profile.experience.splice(removeIndex, 1); 

             profile.save().then(profile => res.json(profile));

        
        })
        .catch(error => res.status(404).json(error));
});


/**
 * @route DELETE api/profile/education/:edu_id
 * @desc Delete education from profile
 * @access Private 
 */

router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(profile => {

            /**
             * Get remove index
             */

            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);


            /**
             * Splice out of array
             */

            profile.education.splice(removeIndex, 1);

            profile.save().then(profile => res.json(profile));


        })
        .catch(error => res.status(404).json(error));
});

/**
 * @route DELETE api/profile
 * @desc Delete user and profile
 * @access Private 
 */

router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {

   Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
        User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true})); 
    });
});

module.exports = router;

