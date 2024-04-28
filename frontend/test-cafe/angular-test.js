import { Selector } from 'testcafe';

fixture `Frontend Tests`
  .page `http://localhost:4200`;

test('Full navigation and interaction test', async t => {
  // Updated selectors for clarity
  const homeButton = Selector('button').withText('Home');
  const joinTravelButton = Selector('button').withText('Join Travel');
  const loginButton = Selector('button').withText('Login');
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

  // Navigate back to Home and check
  await t
    .click(homeButton)
    .expect(title1.exists)
    .ok('Did not navigate back to Home page or "Travelship" title was not found')
});
