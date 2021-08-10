<?php

namespace App\Controller\Api;

use App\Repository\CategoriesRepository;
use App\Repository\UsersRepository;
use App\Repository\PrestationsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


class GetCategory extends AbstractController
{
    /**
     * @var UsersRepository
     */
    protected $userRepo;

    /**
     * @var CategoriesRepository
     */
    protected $categoryRepo;

    /**
     * GetCategory constructor.
     * @param UsersRepository $userRepo
     * @param CategoriesRepository $categoryRepo
     */
    public function __construct(
                                UsersRepository $userRepo,
                                CategoriesRepository $categoryRepo
                               )
    {
        $this->userRepository = $userRepo;
        $this->categoryRepo = $categoryRepo;
    }

    /**
     * @param $data
     * @return mixed
     * @throws \Exception
     */
    public function __invoke($id)
    {
        $user = $this->userRepository->find($id);

        $categories = $this->categoryRepo->findCategoryByUser($user);

        return [
            'prestations' => $categories,
            'message' => 'success',
        ];
    }
}