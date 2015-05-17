require 'spec_helper'

describe 'piece CRUD', js: true, type: :feature do

  before do
    User.create!(
      email: 'sup@example.org',
      password: 'corn',
    )
  end
  before do
    visit('/')
    page.find('.glyphicon-log-in').click
    within('#login-form') do
      fill_in('email', with: 'sup@example.org')
      fill_in('password', with: 'corn')
    end
    click_button('Sign in')
    click_link('My Pieces')
  end

  it 'should create and display piece' do
    click_button('Add Piece')
    fill_in('title', with: 'test')
    fill_in('content', with: 'a bunch of test text')
    click_button('Submit')
    click_button('My Pieces')
    page.find('.dropdown li:first-of-type').click
    page.should have_content('a bunch of test text')
  end

  context 'with pieces' do
    before do
      click_button('Add Piece')
      fill_in('title', with: 'test')
      fill_in('content', with: 'a bunch of test text')
      click_button('Submit')
      click_button('My Pieces')
      page.find('.dropdown li:first-of-type').click
      page.should have_content('a bunch of test text')
    end

    it 'should delete' do
      click_button('Delete')
      page.should_not have_content('a bunch of test text')
      Piece.count.should eq(0)
    end

    it 'should edit the text' do
      click_button('Edit')
      fill_in('edit-content', with: 'reogherougbeprougnre')
      click_button('Done')
      page.should have_content('reogherougbeprougnre')
    end
  end

end
