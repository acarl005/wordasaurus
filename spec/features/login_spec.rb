require 'spec_helper'

describe 'the login process', js: true, type: :feature do

  before do
    User.create!(
      email: 'andy@example.org',
      password: 'corn',
    )
  end

  context 'when invalid' do
    it 'rejects invalid info' do
      visit('/')
      click_link('Login form')
      within('#login-form') do
        fill_in('email', with: 'andy@example.org')
        fill_in('password', with: 'erjigbe')
      end
      click_button('Sign in')
      page.body.should include('invalid')
    end
  end

  context 'when valid' do
    it 'signs in and out' do
      visit('/')
      click_link('Login form')
      within('#login-form') do
        fill_in('email', with: 'andy@example.org')
        fill_in('password', with: 'corn')
      end
      click_button('Sign in')
      page.body.should_not include('Sign up now!')
      click_link('Sign out')
      page.body.should include('Sign up now!')
    end
  end

end

describe 'the signup process', js: true, type: :feature do

  context 'when invalid' do

    it 'rejects unmatching passwords' do
      visit('/')
      click_button('Sign up now!')
      within('.modal-body') do
        fill_in('email', with: 'john@example.org')
        fill_in('password', with: 'corn')
        fill_in('conf-password', with: 'corerghrn')
      end
      page.find('.modal-body').click
      page.body.should include('disabled')
    end

    it 'rejects without email' do
      visit('/')
      click_button('Sign up now!')
      within('.modal-body') do
        fill_in('password', with: 'corn')
        fill_in('conf-password', with: 'corn')
      end
      page.find('.modal-body').click
      click_button('Sign up')
      User.count.should eq(0)
    end

  end

  context 'when valid' do
    it 'registers a user' do
      visit('/')
      click_button('Sign up now!')
      within('.modal-body') do
        fill_in('email', with: 'john@example.org')
        fill_in('password', with: 'corn')
        fill_in('conf-password', with: 'corn')
      end
      page.find('.modal-body').click
      click_button('Sign up')
      User.where(email: "john@example.org").length.should eq(1)
    end
  end

end
