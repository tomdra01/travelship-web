import { Selector } from 'testcafe';

fixture `Frontend Tests`
  .page `http://164.68.109.76:80/`;

test('Full navigation and interaction test', async t => {
  // BUTTON SELECTORS
  const homeButton = Selector('button').withText('Home');
  const joinTravelButton = Selector('button').withText('Join Travel');
  const aboutUsButton = Selector('button').withText('About Us');
  const loginButton = Selector('button').withText('Login');
  const planATripButton = Selector('button').withText('Plan a Trip');
  const viewPublicTripsButton = Selector('button').withText('View Public Trips');

  // ELEMENT SELECTORS
  const aboutUsText = Selector('h1').withText('About Travelship');
  const joinTripInput = Selector('input').withAttribute('placeholder', 'Enter trip code');
  const title1 = Selector('#title');


  // Login and check
  await t
    .click(loginButton)
    .expect(Selector('button.middleCenter').withText('Login With Google').exists)
    .ok('Login With Google button is not present on the Login page');

  // Navigate to Join Travel and check
  await t
    .click(joinTravelButton)
    .expect(joinTripInput.exists)
    .ok('Did not navigate to Join Travel page or the specific input field was not found');

  // Navigate to About Us and check
  await t
    .click(aboutUsButton)
    .expect(aboutUsText.exists)
    .ok('Did not navigate to About Us page or "About Travelship" title was not found');

  // Navigate back to Home and check
  await t
    .click(homeButton)
    .expect(title1.exists)
    .ok('Did not navigate back to Home page or "Travelship" title was not found')

  // Navigate to Plan a Trip and check
  await t
    .click(planATripButton)
    .expect(Selector('div').withText('Create Trip').exists)
    .ok('Did not navigate to Plan a Trip page or "Plan a Trip" title was not found');

  // Navigate back to Home and check
  await t
    .click(homeButton)
    .expect(title1.exists)
    .ok('Did not navigate back to Home page or "Travelship" title was not found');

  // Navigate to View Public Trips and check
  await t
    .click(viewPublicTripsButton)
    .expect(Selector('div').withText('Public Trips').exists)
    .ok('Did not navigate to View Public Trips page or "Public Trips" title was not found');
});
